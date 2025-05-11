package com.exam.Scheduler.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ProctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Teacher teacher;

    @ManyToOne
    private Subject subject;

    private int day;
    private int slot;

    private String roomName;
    private int isRemove=0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
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

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getExamDate() {
        return examDate;
    }

    public void setExamDate(String examDate) {
        this.examDate = examDate;
    }

    private String examDate; // hoặc LocalDate nếu bạn dùng dạng ngày

    // Constructors
    public ProctorSchedule() {
    }

    public ProctorSchedule(Teacher teacher, Subject subject, int day, int slot, String roomName, String examDate) {
        this.teacher = teacher;
        this.subject = subject;
        this.day = day;
        this.slot = slot;
        this.roomName = roomName;
        this.examDate = examDate;
    }
}
