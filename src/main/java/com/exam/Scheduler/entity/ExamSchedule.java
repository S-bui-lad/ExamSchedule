package com.exam.Scheduler.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "exam_schedule")
public class ExamSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int day;
    private int slot;
    private LocalDate examDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToMany
    @JoinTable(
            name = "exam_schedule_rooms",
            joinColumns = @JoinColumn(name = "exam_schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "exam_room_id")
    )
    private List<ExamRoom> assignedRooms;

    public ExamSchedule() {}

    public ExamSchedule(Subject subject, int day, int slot, List<ExamRoom> assignedRooms, LocalDate examDate) {
        this.subject = subject;
        this.day = day;
        this.slot = slot;
        this.assignedRooms = assignedRooms;
        this.examDate = examDate;
    }

    // --- Getter & Setter ---
    public Long getId() {
        return id;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public int getSlot() {
        return slot;
    }

    public void setSlot(int slot) {
        this.slot = slot;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public List<ExamRoom> getAssignedRooms() {
        return assignedRooms;
    }

    public void setAssignedRooms(List<ExamRoom> assignedRooms) {
        this.assignedRooms = assignedRooms;
    }
}
