package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.ExamRoom;
import com.exam.Scheduler.entity.Student;
import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.repository.SubjectRepository;
import jxl.Workbook;
import jxl.Sheet;
import jxl.read.biff.BiffException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ExcelService {
    private final ExamRoomService examRoomService;
    private final SubjectService subjectService;
    private final SubjectRepository subjectRepository;
    private final StudentService studentService;
    public ExcelService(ExamRoomService examRoomService, SubjectService subjectService, SubjectRepository subjectRepository, StudentService studentService) {
        this.examRoomService = examRoomService;
        this.subjectService = subjectService;
        this.subjectRepository = subjectRepository;
        this.studentService = studentService;
    }

    // Đọc danh sách phòng thi từ file Excel
    public List<ExamRoom> readExamRoom(MultipartFile file) throws IOException, BiffException {
        examRoomService.deleteAllExamRooms();
        List<ExamRoom> examRooms = new ArrayList<>();
        InputStream inputStream = file.getInputStream();
        Workbook workbook = Workbook.getWorkbook(inputStream);
        Sheet sheet = workbook.getSheet(0); // Lấy sheet đầu tiên

        for (int i = 1; i < sheet.getRows(); i++) { // Bỏ qua tiêu đề
            ExamRoom newExamRoom = new ExamRoom();
            newExamRoom.setMP(getCellValue(sheet, i, 0)); // Mã phòng thi
            newExamRoom.setQuantity(parseInteger(getCellValue(sheet, i, 1))); // Sức chứa
            newExamRoom.setTenPhong(getCellValue(sheet,i,2));
            newExamRoom.setNote(getCellValue(sheet, i, 3)); // Ghi chú

            examRooms.add(examRoomService.handleCreateExamRoom(newExamRoom));
        }
        workbook.close();
        return examRooms;
    }

    // Đọc danh sách môn học từ file Excel
    public List<Subject> readSubject(MultipartFile file) throws IOException, BiffException {
//        subjectService.deleteAllSubjects();
        List<Subject> subjects = new ArrayList<>();
        InputStream inputStream = file.getInputStream();
        Workbook workbook = Workbook.getWorkbook(inputStream);
        Sheet sheet = workbook.getSheet(0);

        for (int i = 1; i < sheet.getRows(); i++) { // Bỏ qua tiêu đề
            Subject newSubject = new Subject();
            newSubject.setMaMon(getCellValue(sheet, i, 0));
            newSubject.setTenMon(getCellValue(sheet, i, 1));
            newSubject.setNhom(getCellValue(sheet, i, 2));
            newSubject.setNest(getCellValue(sheet, i, 3));
            newSubject.setHinhthuc(getCellValue(sheet, i, 9));

            subjects.add(subjectService.handleCreateSubject(newSubject));
        }
        workbook.close();
        return subjects;
    }

    // Đọc danh sách SV từ file excel
    public List<Student> readStudent(MultipartFile file) throws IOException, BiffException {
        List<Student> students = new ArrayList<>();
        InputStream inputStream = file.getInputStream();
        Workbook workbook = Workbook.getWorkbook(inputStream);
        Sheet sheet = workbook.getSheet(0);

        for (int i = 1; i < sheet.getRows(); i++) {
            Student newStudent = new Student();
            newStudent.setMssv(getCellValue(sheet, i, 0));
            newStudent.setName(getCellValue(sheet, i, 1));
            newStudent.setLop(getCellValue(sheet, i, 2));
            newStudent.setEmail(getCellValue(sheet, i, 3));

            String subjectCodes = getCellValue(sheet, i, 4);
            Set<Subject> subjects = new HashSet<>();
            if (subjectCodes != null && !subjectCodes.isEmpty()) {
                for (String code : subjectCodes.split(",")) {
                    code = code.trim();
                    List<Subject> subjectList = subjectRepository.findByMaMon(code); // Lấy danh sách môn học thay vì một môn
                    subjects.addAll(subjectList); // Thêm tất cả các môn học tìm được vào Set
                }
            }

            newStudent.setDanhSachMonHoc(new ArrayList<>(subjects));
            students.add(studentService.handlCreateStudent(newStudent));
        }

        workbook.close();
        return students;
    }

    // Phương thức lấy giá trị từ ô Excel, tránh lỗi NullPointerException
    private String getCellValue(Sheet sheet, int row, int column) {
        return (sheet.getColumns() > column && sheet.getCell(column, row) != null) ? sheet.getCell(column, row).getContents().trim() : "";
    }

    // Chuyển đổi String sang Integer, tránh lỗi NumberFormatException
    private int parseInteger(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0; // Giá trị mặc định nếu không đọc được số
        }
    }
}
