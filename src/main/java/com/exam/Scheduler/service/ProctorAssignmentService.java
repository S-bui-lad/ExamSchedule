package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.entity.ProctorSchedule;
import com.exam.Scheduler.entity.Teacher;
import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.repository.ProctorScheduleRepository;
import com.exam.Scheduler.repository.TeacherRepository;
import com.exam.Scheduler.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProctorAssignmentService {

    private static final int EXAMS_PER_DAY = 4;

    private final TeacherRepository teacherRepository;
    private final ProctorScheduleRepository proctorScheduleRepository;
    private final SubjectRepository subjectRepository;

    public ProctorAssignmentService(TeacherRepository teacherRepository, 
                                  ProctorScheduleRepository proctorScheduleRepository,
                                  SubjectRepository subjectRepository) {
        this.teacherRepository = teacherRepository;
        this.proctorScheduleRepository = proctorScheduleRepository;
        this.subjectRepository = subjectRepository;
    }

    public void saveProctorSchedules(List<ProctorSchedule> schedules) {
        proctorScheduleRepository.saveAll(schedules);
    }

    public List<ProctorSchedule> getAllSchedules() {
        return proctorScheduleRepository.findAll();
    }

    public String assignProctorsFromExcel(MultipartFile file) throws IOException, BiffException {
        // Đọc thông tin môn thi và phòng thi từ file Excel
        List<ExamRoomAssignment> examRoomAssignments = readExamRoomAssignmentsFromExcel(file);
        if (examRoomAssignments.isEmpty()) {
            return "Không tìm thấy dữ liệu môn thi trong file Excel";
        }

        // Lấy danh sách giảng viên từ database
        List<Teacher> teachers = teacherRepository.findAll();
        if (teachers.isEmpty()) {
            return "Không có giảng viên nào trong hệ thống";
        }

        List<ProctorSchedule> result = new ArrayList<>();
        Map<String, Set<Long>> assignedPerSlot = new HashMap<>(); // key: mã môn + ngày + ca

        for (ExamRoomAssignment assignment : examRoomAssignments) {
            String slotKey = assignment.subjectCode + "_" + assignment.examDate + "_" + assignment.slot;
            Set<Long> assigned = assignedPerSlot.computeIfAbsent(slotKey, k -> new HashSet<>());

            // Lấy danh sách giảng viên khả dụng cho slot này
            List<Teacher> availableTeachers = teachers.stream()
                    .filter(t -> t.isStatus() && !assigned.contains(t.getId()))
                    .collect(Collectors.toList());

            int requiredTeachers = assignment.roomNames.size() * 2;
            if (availableTeachers.size() < requiredTeachers) {
                return "Không đủ giảng viên cho môn: " + assignment.subjectCode +
                        " (Cần " + requiredTeachers + " giảng viên cho " + assignment.roomNames.size() + " phòng)";
            }

            // Phân bổ 2 giảng viên cho từng phòng
            int teacherIdx = 0;
            for (String room : assignment.roomNames) {
                List<Teacher> roomProctors = availableTeachers.subList(teacherIdx, teacherIdx + 2);
                teacherIdx += 2;
                for (Teacher proctor : roomProctors) {
                    assigned.add(proctor.getId());
                    result.add(new ProctorSchedule(
                            proctor,
                            null, // subject sẽ null, hoặc có thể lấy từ DB nếu cần
                            assignment.day,
                            assignment.slot,
                            room,
                            assignment.examDate,
                            1
                    ));
                }
            }
        }

        proctorScheduleRepository.saveAll(result);
        return "Đã tạo và lưu lịch coi thi thành công.";
    }

    // Đọc file Excel đúng mẫu: mã môn, ngày thi, ca thi, phòng thi
    private List<ExamRoomAssignment> readExamRoomAssignmentsFromExcel(MultipartFile file) throws IOException, BiffException {
        List<ExamRoomAssignment> assignments = new ArrayList<>();
        try (InputStream is = file.getInputStream()) {
            Workbook workbook = Workbook.getWorkbook(is);
            Sheet sheet = workbook.getSheet(0);
            for (int i = 1; i < sheet.getRows(); i++) {
                String subjectCode = sheet.getCell(0, i).getContents().trim();
                String examDate = sheet.getCell(2, i).getContents().replace("Ngày ", "").trim();
                String slotStr = sheet.getCell(3, i).getContents().replace("Ca ", "").trim();
                String roomStr = sheet.getCell(4, i).getContents().trim();
                if (subjectCode.isEmpty() || examDate.isEmpty() || slotStr.isEmpty() || roomStr.isEmpty()) continue;
                int slot = 1;
                try { slot = Integer.parseInt(slotStr); } catch (Exception ignored) {}
                int day = 1; // Nếu cần lấy số ngày, có thể tính toán từ examDate
                List<String> roomNames = Arrays.stream(roomStr.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
                assignments.add(new ExamRoomAssignment(subjectCode, examDate, day, slot, roomNames));
            }
        }
        return assignments;
    }

    // Lớp phụ trợ để lưu thông tin từng dòng trong file Excel
    private static class ExamRoomAssignment {
        String subjectCode;
        String examDate;
        int day;
        int slot;
        List<String> roomNames;
        public ExamRoomAssignment(String subjectCode, String examDate, int day, int slot, List<String> roomNames) {
            this.subjectCode = subjectCode;
            this.examDate = examDate;
            this.day = day;
            this.slot = slot;
            this.roomNames = roomNames;
        }
    }

    private int encodeSlot(int day, int slot) {
        return (day - 1) * EXAMS_PER_DAY + slot;
    }
}

