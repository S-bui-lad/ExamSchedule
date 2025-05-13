package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.ProctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProctorScheduleRepository extends JpaRepository<ProctorSchedule, Long> {
    @Query(value = "select p from ProctorSchedule p where p.isRemove=1")
    List<ProctorSchedule> findAll();
}