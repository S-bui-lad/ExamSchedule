package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Student;
import com.exam.Scheduler.entity.Subject;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
       @Query("SELECT s FROM Student s JOIN s.danhSachMonHoc m WHERE s.isRemove = 0 AND m.maMon = :maMon and m.isRemove=0")
       List<Student> findByDanhSachMonHoc_MaMon(@Param("maMon") String maMon);

       @Query("select s from Student s where s.isRemove=0 and s.id= :id")
       Optional<Student> findById(@Param("id") long id);

       @Query(value = "select s from Student s where s.isRemove = 0")
       List<Student> findAll();
       @Transactional
       @Modifying
       @Query("UPDATE Student s SET s.isRemove = 1 WHERE s.id = :id")
       boolean deleteById(@Param("id") long id);

       @Transactional
       @Modifying
       @Query("update Student s set s.isRemove=1")
       void deleteAll();

}
