package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.ExamRoom;
import com.exam.Scheduler.entity.Subject;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import jxl.Sheet;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

@Service
public class ExcelService {
    private final ExamRoomService examRoomService;
    private final SubjectService subjectService;


    public ExcelService(ExamRoomService examRoomService, SubjectService subjectService) {
        this.examRoomService = examRoomService;
        this.subjectService = subjectService;
    }

    public ArrayList<ExamRoom> readExamRoom(String filename) throws IOException, BiffException {
        ArrayList<ExamRoom> examRooms = new ArrayList<>();
        File file = new File(filename);
        Workbook workbook = Workbook.getWorkbook(file);
        Sheet sheet = workbook.getSheet(0);

        for (int i = 1; i < sheet.getRows(); i++) { // Bắt đầu từ dòng 1 để bỏ qua header
            String col1 = sheet.getCell(0, i).getContents();  // Mã phòng
            String col2 = sheet.getCell(1, i).getContents();  // Số lượng chỗ ngồi
            String col3 = sheet.getCell(2, i).getContents();  // teacher
            String col4 = (sheet.getColumns() > 3) ? sheet.getCell(3, i).getContents() : ""; // Thông tin bổ sung logic fix

            ExamRoom newExamRoom = new ExamRoom();
            newExamRoom.setMP(col1);
            newExamRoom.setQuantity(Integer.parseInt(col2));
            newExamRoom.setTeacher(col3);
            newExamRoom.setNote(col4);
            examRooms.add(this.examRoomService.handleCreateExamRoom(newExamRoom));
        }
        workbook.close();
        return examRooms;
    }

    public ArrayList<Subject> readSubject(String filename) throws IOException, BiffException{
        ArrayList<Subject> subjects = new ArrayList<>();
        File file = new File(filename);
        Workbook workbook = Workbook.getWorkbook(file);
        Sheet sheet = workbook.getSheet(0);

        for (int i = 1; i < sheet.getRows(); i++) { // Bắt đầu từ dòng 1
            String col1 = sheet.getCell(0, i).getContents(); // Mã môn học
            String col2 = sheet.getCell(1, i).getContents(); // Tên Môn Học
            String col3 = sheet.getCell(2, i).getContents(); // Số tín chỉ
            String col4 = sheet.getCell(3, i).getContents(); // Học kỳ
            String col5 = sheet.getCell(4, i).getContents(); // Năm học
            String col6 = sheet.getCell(5, i).getContents(); // Số lượng sinh viên
            String col7 = sheet.getCell(6, i).getContents(); // GV 1
            String col8 = sheet.getCell(7, i).getContents(); // GV 2
            String col9 = sheet.getCell(8, i).getContents(); // Thời gian thi
            String col10 = sheet.getCell(9, i).getContents(); // Phòng thi

            Subject newSubject = new Subject();
            newSubject.setMaMon(col1);
            newSubject.setTenMon(col2);
            newSubject.setSoTinChi(col3);
            newSubject.setHocKy(col4);
            newSubject.setNamHoc(col5);
            newSubject.setSoLuongSinhVien(col6);
            newSubject.setGv1(col7);
            newSubject.setGv2(col8);
            newSubject.setThoiGianThi(col9);
            newSubject.setPhongThi(col10);

            subjects.add(this.subjectService.handleCreateSubject(newSubject));
        }
        workbook.close();
        return subjects;
        }
}
