package com.exam.Scheduler.entity;

import java.util.List;

public class ExamSchedule {
    private Subject subject;
    private int day;
    private int slot;
    private List<ExamRoom> assignedRooms;

    public ExamSchedule(Subject subject, int day, int slot, List<ExamRoom> assignedRooms) {
        this.subject = subject;
        this.day = day;
        this.slot = slot;
        this.assignedRooms = assignedRooms;
    }

    public Subject getSubject() {
        return subject;
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

