package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Student;
import com.exam.Scheduler.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
       List<Student> findByDanhSachMonHoc_MaMon(String maMon);
}
