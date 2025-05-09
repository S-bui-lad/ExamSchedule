package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.ProctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProctorScheduleRepository extends JpaRepository<ProctorSchedule, Long> {
}