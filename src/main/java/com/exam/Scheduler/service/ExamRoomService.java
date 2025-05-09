package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.ExamRoom;
import com.exam.Scheduler.repository.ExamRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamRoomService {
    private ExamRoomRepository examRoomRepository;

    public ExamRoomService(ExamRoomRepository examRoomRepository){
        this.examRoomRepository = examRoomRepository;
    }

    public ExamRoom handleCreateExamRoom(ExamRoom examRoom){
        return this.examRoomRepository.save(examRoom);
    }

    public void handleDeleteExamRoom(long id){
        this.examRoomRepository.deleteById(id);
    }

    public void deleteAllExamRooms() {
        examRoomRepository.deleteAll();
    }

    public ExamRoom fetchExamRoomById(long id){
        Optional<ExamRoom> examRoomOptional = this.examRoomRepository.findById(id);
        if (examRoomOptional.isPresent()){
            return examRoomOptional.get();
        }
        return null;
    }

    public List<ExamRoom> fetchAllExamRoom(){
        return this.examRoomRepository.findAll();
    }

    public ExamRoom handleUpdateExamRoom(ExamRoom reqExamRoom){
        ExamRoom currentExamRoom = this.fetchExamRoomById(reqExamRoom.getId());
        if (currentExamRoom != null){
            currentExamRoom.setQuantity(reqExamRoom.getQuantity());
            currentExamRoom.setMP(reqExamRoom.getMP());

            currentExamRoom = this.examRoomRepository.save(currentExamRoom);
        }
        return currentExamRoom;
    }

}
