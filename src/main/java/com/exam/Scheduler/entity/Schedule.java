package com.exam.Scheduler.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Exam exam;

    @ManyToOne
    private Teacher teacher1;

    @ManyToOne
    private Teacher teacher2;

    private Integer timeSlot; // Ca thi
}
