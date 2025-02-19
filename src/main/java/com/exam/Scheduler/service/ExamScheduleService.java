package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.*;
import com.exam.Scheduler.repository.ExamRoomRepository;
import com.exam.Scheduler.repository.StudentRepository;
import com.exam.Scheduler.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExamScheduleService {
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final ExamRoomRepository examRoomRepository;

    private final StudentService studentService;

    private static final int EXAM_DAYS = 14;
    private static final int EXAMS_PER_DAY = 4;

    public ExamScheduleService(SubjectRepository subjectRepository, StudentRepository studentRepository, ExamRoomRepository examRoomRepository, StudentService studentService) {
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.examRoomRepository = examRoomRepository;
        this.studentService = studentService;
    }

    public List<ExamSchedule> scheduleExams() {
        List<Subject> subjects = subjectRepository.findAll();
        List<ExamRoom> examRooms = examRoomRepository.findAll();
        Map<String, Set<String>> conflicts = buildConflictGraph();
        Map<String, Integer> subjectSchedule = new HashMap<>();
        List<ExamSchedule> examSchedules = new ArrayList<>();

        int day = 1, slot = 1;

        for (Subject subject : subjects) {
            Set<Integer> usedSlots = new HashSet<>();
            for (String neighbor : conflicts.getOrDefault(subject.getSubjectCode(), new HashSet<>())) {
                if (subjectSchedule.containsKey(neighbor)) {
                    usedSlots.add(subjectSchedule.get(neighbor));
                }
            }

            while (usedSlots.contains((day - 1) * EXAMS_PER_DAY + slot)) {
                slot++;
                if (slot > EXAMS_PER_DAY) {
                    slot = 1;
                    day++;
                    if (day > EXAM_DAYS) {
                        throw new RuntimeException("Không thể xếp lịch trong giới hạn 14 ngày");
                    }
                }
            }

            subjectSchedule.put(subject.getSubjectCode(), (day - 1) * EXAMS_PER_DAY + slot);
            List<ExamRoom> assignedRooms = assignExamRooms(subject, examRooms);
            examSchedules.add(new ExamSchedule(subject, day, slot, assignedRooms));
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

    private List<ExamRoom> assignExamRooms(Subject subject, List<ExamRoom> rooms) {
        List<Student> students = studentRepository.findByDanhSachMonHoc_MaMon(subject.getSubjectCode());
        int totalStudents = students.size();
        List<ExamRoom> assignedRooms = new ArrayList<>();

        for (ExamRoom room : rooms) {
            if (totalStudents <= 0) break;
            int assigned = Math.min(totalStudents, room.getQuantity());
            totalStudents -= assigned;
            assignedRooms.add(room);
        }

        if (totalStudents > 0) {
            throw new RuntimeException("Không đủ phòng thi cho môn: " + subject.getTenMon());
        }
        return assignedRooms;
    }
}
