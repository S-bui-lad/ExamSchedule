package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Teacher;
import com.exam.Scheduler.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "select u from User u where u.email = :email and u.isRemove=0")
    Optional<User> findByEmail(@Param("email") String email);

    @Query(value = "SELECT t from User t where t.isRemove = 0")
    List<User> findAll();
    @Query(value = "SELECT t from User t where t.isRemove=0 and t.id = :id")
    Optional<User> findById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("UPDATE User s SET s.isRemove = 1 WHERE s.id = :id")
    boolean deleteById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("update User s set s.isRemove=1")
    void deleteAll();
}
