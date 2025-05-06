package com.exam.Scheduler.entity;

import java.time.LocalDate;
import java.util.List;

public class ExamSchedule {
    private Subject subject;
    private int day;
    private int slot;
    private List<ExamRoom> assignedRooms;
    private LocalDate examDate;

    public ExamSchedule(Subject subject, int day, int slot, List<ExamRoom> assignedRooms, LocalDate examDate) {
        this.subject = subject;
        this.day = day;
        this.slot = slot;
        this.assignedRooms = assignedRooms;
        this.examDate = examDate;
    }

    public Subject getSubject() {
        return subject;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
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

    public List<ExamRoom> getAssignedRooms() {
        return assignedRooms;
    }

    public void setAssignedRooms(List<ExamRoom> assignedRooms) {
        this.assignedRooms = assignedRooms;
    }
}

