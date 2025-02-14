package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Exam;
import com.exam.Scheduler.entity.Schedule;
import com.exam.Scheduler.entity.Teacher;
import com.exam.Scheduler.repository.ScheduleRepository;
import com.exam.Scheduler.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GraphColoringService {
    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<Schedule> scheduleExams(List<Exam> exams) {
        Map<Exam, Integer> examTimeSlots = colorGraph(buildGraph(exams));
        List<Teacher> teachers = teacherRepository.findAll();
        return assignTeachers(examTimeSlots, teachers);
    }

    // Xây dựng đồ thị dựa trên các môn thi
    private Map<Exam, List<Exam>> buildGraph(List<Exam> exams) {
        Map<Exam, List<Exam>> graph = new HashMap<>();
        for (Exam e1 : exams) {
            graph.putIfAbsent(e1, new ArrayList<>());
            for (Exam e2 : exams) {
                if (!e1.equals(e2) && e1.getExamTime().equals(e2.getExamTime())) {
                    graph.get(e1).add(e2);
                }
            }
        }
        return graph;
    }

    // Áp dụng thuật toán tô màu đồ thị để xếp ca thi (timeSlot)
    private Map<Exam, Integer> colorGraph(Map<Exam, List<Exam>> graph) {
        Map<Exam, Integer> result = new HashMap<>();
        for (Exam exam : graph.keySet()) {
            Set<Integer> usedColors = new HashSet<>();
            for (Exam neighbor : graph.get(exam)) {
                if (result.containsKey(neighbor)) {
                    usedColors.add(result.get(neighbor));
                }
            }
            int color = 0;
            while (usedColors.contains(color)) {
                color++;
            }
            result.put(exam, color);
        }
        return result;
    }

    // Gán giảng viên vào các ca thi dựa trên timeSlot
    private List<Schedule> assignTeachers(Map<Exam, Integer> examTimeSlots, List<Teacher> teachers) {
        List<Schedule> schedules = new ArrayList<>();
        Map<Integer, Set<Teacher>> teacherAvailability = new HashMap<>();

        // Khởi tạo danh sách giảng viên rảnh rỗi theo từng ca thi
        for (int timeSlot : new HashSet<>(examTimeSlots.values())) {
            teacherAvailability.put(timeSlot, new HashSet<>(teachers));
        }

        for (Map.Entry<Exam, Integer> entry : examTimeSlots.entrySet()) {
            Exam exam = entry.getKey();
            int timeSlot = entry.getValue();

            // Lấy danh sách giảng viên còn rảnh cho ca thi này
            Set<Teacher> availableTeachers = teacherAvailability.get(timeSlot);

            if (availableTeachers.size() < 2) {
                throw new RuntimeException("Không đủ giảng viên để phân công cho môn " + exam.getSubject());
            }

            // Lấy hai giảng viên đầu tiên
            Iterator<Teacher> iterator = availableTeachers.iterator();
            Teacher teacher1 = iterator.next();
            Teacher teacher2 = iterator.next();

            // Xóa giảng viên khỏi danh sách rảnh rỗi trong ca thi này
            availableTeachers.remove(teacher1);
            availableTeachers.remove(teacher2);

            // Tạo lịch thi
            Schedule schedule = new Schedule(null, exam, teacher1, teacher2, timeSlot);
            schedules.add(schedule);
        }

        // Lưu lịch thi vào database
        scheduleRepository.saveAll(schedules);
        return schedules;
    }
}