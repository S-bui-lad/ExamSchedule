package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Exam;
import com.exam.Scheduler.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {
    @Autowired
    private ExamRepository examRepository;

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public void saveExam(Exam exam) {
        examRepository.save(exam);
    }
}
