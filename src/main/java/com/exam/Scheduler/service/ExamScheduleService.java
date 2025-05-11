package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.*;
import com.exam.Scheduler.repository.ExamRoomRepository;
import com.exam.Scheduler.repository.ExamScheduleRepository;
import com.exam.Scheduler.repository.StudentRepository;
import com.exam.Scheduler.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamScheduleService {
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final ExamRoomRepository examRoomRepository;
    private final ExamScheduleRepository examScheduleRepository;

    private static final int EXAM_DAYS = 14;
    private static final int EXAMS_PER_DAY = 4;

    public ExamScheduleService(SubjectRepository subjectRepository, StudentRepository studentRepository, ExamRoomRepository examRoomRepository, ExamScheduleRepository examScheduleRepository) {
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.examRoomRepository = examRoomRepository;
        this.examScheduleRepository = examScheduleRepository;
    }

    public List<ExamSchedule> getAllExamSchedules() {
        return examScheduleRepository.findAllByOrderByExamDateAsc();
    }

    public List<ExamSchedule> scheduleExams(LocalDate startDate) {
        List<Subject> subjects = subjectRepository.findAll();
        List<ExamRoom> examRooms = examRoomRepository.findAll();
        Map<String, Set<String>> conflicts = buildConflictGraph();
        Map<String, Integer> subjectSchedule = new HashMap<>();
        List<ExamSchedule> examSchedules = new ArrayList<>();

        // Sắp xếp môn học theo số lượng xung đột giảm dần
        subjects.sort((s1, s2) ->
                Integer.compare(conflicts.get(s2.getSubjectCode()).size(), conflicts.get(s1.getSubjectCode()).size())
        );

        // Sắp xếp phòng theo sức chứa giảm dần
        examRooms.sort((r1, r2) -> Integer.compare(r2.getQuantity(), r1.getQuantity()));

        // Theo dõi phòng đã dùng theo từng slot (1 slot = 1 ca trong 1 ngày)
        Map<Integer, Set<String>> usedRoomsPerSlot = new HashMap<>();

        for (Subject subject : subjects) {
            Set<Integer> usedSlots = new HashSet<>();

            // Lấy các slot đã dùng bởi các môn học xung đột
            for (String neighbor : conflicts.getOrDefault(subject.getSubjectCode(), new HashSet<>())) {
                if (subjectSchedule.containsKey(neighbor)) {
                    usedSlots.add(subjectSchedule.get(neighbor));
                }
            }

            // Tìm slot khả dụng
            int slotCode = 1;
            while (
                    usedSlots.contains(slotCode) ||
                            (usedRoomsPerSlot.containsKey(slotCode) &&
                                    !canAssignRooms(subject, examRooms, usedRoomsPerSlot.get(slotCode)))
            ) {
                slotCode++;
                if (slotCode > EXAM_DAYS * EXAMS_PER_DAY) {
                    throw new RuntimeException("Không thể xếp lịch trong giới hạn 14 ngày");
                }
            }

            subjectSchedule.put(subject.getSubjectCode(), slotCode);

            int[] daySlot = decodeSlot(slotCode); // [ngày, ca]
            LocalDate examDate = startDate.plusDays(daySlot[0] - 1);

            Set<String> usedRoomNames = usedRoomsPerSlot.computeIfAbsent(slotCode, k -> new HashSet<>());
            List<ExamRoom> assignedRooms = assignExamRooms(subject, examRooms, usedRoomNames);

            examSchedules.add(new ExamSchedule(subject, daySlot[0], daySlot[1], assignedRooms, examDate));
        }
        return examSchedules;
    }
    private Map<String, Set<String>> buildConflictGraph() {
        Map<String, Set<String>> conflicts = new HashMap<>();
        List<Student> students = studentRepository.findAll();

        // Đảm bảo tất cả các môn học đều có entry trong conflicts
        for (Subject subject : subjectRepository.findAll()) {
            conflicts.put(subject.getSubjectCode(), new HashSet<>());
        }

        for (Student student : students) {
            List<Subject> subjects = studentRepository.findById(student.getId())
                    .map(Student::getDanhSachMonHoc)
                    .orElse(Collections.emptyList());

            for (int i = 0; i < subjects.size(); i++) {
                for (int j = i + 1; j < subjects.size(); j++) {
                    conflicts.get(subjects.get(i).getSubjectCode()).add(subjects.get(j).getSubjectCode());
                    conflicts.get(subjects.get(j).getSubjectCode()).add(subjects.get(i).getSubjectCode());
                }
            }
        }
        return conflicts;
    }
    // Tách logic mã hóa ngày-slot thành mã nguyên
    private int encodeSlot(int day, int slot) {
        return (day - 1) * EXAMS_PER_DAY + slot;
    }

    // Tách logic giải mã từ mã slot sang ngày, ca
    private int[] decodeSlot(int slotCode) {
        int day = (slotCode - 1) / EXAMS_PER_DAY + 1;
        int slot = (slotCode - 1) % EXAMS_PER_DAY + 1;
        return new int[]{day, slot};
    }

    // Kiểm tra đủ phòng còn trống cho môn này trong slot
    private boolean canAssignRooms(Subject subject, List<ExamRoom> rooms, Set<String> usedRoomNames) {
        int totalStudents = studentRepository.findByDanhSachMonHoc_MaMon(subject.getSubjectCode()).size();
        int available = rooms.stream()
                .filter(r -> !usedRoomNames.contains(r.getTenPhong()))
                .mapToInt(ExamRoom::getQuantity)
                .sum();
        return totalStudents <= available;
    }

    // Phân bổ phòng và đánh dấu là đã dùng cho slot đó
    private List<ExamRoom> assignExamRooms(Subject subject, List<ExamRoom> rooms, Set<String> usedRoomNames) {
        List<Student> students = studentRepository.findByDanhSachMonHoc_MaMon(subject.getSubjectCode());
        int totalStudents = students.size();
        List<ExamRoom> assignedRooms = new ArrayList<>();
        for (ExamRoom room : rooms) {
            if (totalStudents <= 0) break;
            if (usedRoomNames.contains(room.getMP())) continue;

            int assigned = Math.min(totalStudents, room.getQuantity());
            totalStudents -= assigned;
            assignedRooms.add(room);
            usedRoomNames.add(room.getTenPhong());
        }

        if (totalStudents > 0) {
            throw new RuntimeException("Không đủ phòng thi cho môn: " + subject.getTenMon());
        }

        return assignedRooms;
    }
}
