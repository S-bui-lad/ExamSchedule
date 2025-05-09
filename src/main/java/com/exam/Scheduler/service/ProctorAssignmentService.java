package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.entity.ProctorSchedule;
import com.exam.Scheduler.entity.Teacher;
import com.exam.Scheduler.repository.ProctorScheduleRepository;
import com.exam.Scheduler.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;


import java.util.*;

@Service
public class ProctorAssignmentService {

    private static final int EXAMS_PER_DAY = 4;

    private final TeacherRepository teacherRepository;
    private ProctorScheduleRepository proctorScheduleRepository;

    public ProctorAssignmentService(TeacherRepository teacherRepository, ProctorScheduleRepository proctorScheduleRepository) {
        this.teacherRepository = teacherRepository;
        this.proctorScheduleRepository = proctorScheduleRepository;
    }

    public void saveProctorSchedules(List<ProctorSchedule> schedules) {
        proctorScheduleRepository.saveAll(schedules);
    }

    public List<ProctorSchedule> getAllSchedules() {
        return proctorScheduleRepository.findAll();
    }

    public String assignProctorsToExams(List<ExamSchedule> examSchedules) {
        List<Teacher> teachers = teacherRepository.findAll();

        List<ProctorSchedule> result = new ArrayList<>();
        Map<Integer, Set<Long>> assignedPerSlot = new HashMap<>();

        for (ExamSchedule exam : examSchedules) {
            int slotCode = encodeSlot(exam.getDay(), exam.getSlot());

            Set<Long> assigned = assignedPerSlot.computeIfAbsent(slotCode, k -> new HashSet<>());
            List<Teacher> available = teachers.stream()
                    .filter(t -> t.isStatus() && !assigned.contains(t.getId()))
                    .limit(2)
                    .collect(Collectors.toList());

            if (available.size() < 2) {
                return "Không đủ giảng viên cho môn: " + exam.getSubject().getTenMon();
            }

            for (Teacher t : available) {
                assigned.add(t.getId());
                result.add(new ProctorSchedule(
                        t,
                        exam.getSubject(),
                        exam.getDay(),
                        exam.getSlot(),
                        exam.getAssignedRooms().get(0).getTenPhong(),
                        exam.getExamDate().toString()
                ));
            }
        }

        proctorScheduleRepository.saveAll(result);
        return "Đã tạo và lưu lịch coi thi thành công.";
    }

    private int encodeSlot(int day, int slot) {
        return (day - 1) * EXAMS_PER_DAY + slot;
    }


}

