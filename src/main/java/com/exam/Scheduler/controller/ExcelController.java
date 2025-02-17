package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamRoom;
import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.service.ExcelService;
import jxl.read.biff.BiffException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.IIOException;
import java.io.IOException;
import java.util.ArrayList;

@RestController
public class ExcelController {
    private ExcelService excelService;
    public ExcelController(ExcelService excelService){
        this.excelService = excelService;
    }

    @GetMapping("/read-exam-rooms")
    public ArrayList<ExamRoom> getExamRoom(@RequestParam String filename) throws BiffException, IOException {
        try{
            return excelService.readExamRoom(filename);
        }catch (IIOException e){
          e.printStackTrace();
          return new ArrayList<>();
        }
    }

    @GetMapping("/read-subjects")
    public ArrayList<Subject> getSubject(@RequestParam String filename) throws BiffException, IOException {
        try{
            return excelService.readSubject(filename);
        }catch (IIOException e){
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

}
