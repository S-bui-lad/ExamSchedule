package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.User;
import com.exam.Scheduler.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;


    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public User handleCreateUser(User user){
       return   this.userRepository.save(user);
    }

    public void handleDeleteUser(long id){
        this.userRepository.deleteById(id);
    }

    public User fetchUserById(long id){
        Optional<User> userOptional = this.userRepository.findById(id);
        if (userOptional.isPresent()){
            return userOptional.get();
        }
        return null;
    }

    public List<User> fetchAllUser(){
        return  this.userRepository.findAll();
    }

    public User handleUpdateUser(long id, User reqUser) {
        User currentUser = this.fetchUserById(id);
        if (currentUser != null) {
            if (reqUser.getEmail() != null) {
                currentUser.setEmail(reqUser.getEmail());
            }
            if (reqUser.getName() != null) {
                currentUser.setName(reqUser.getName());
            }
            if (reqUser.getPassword() != null) {
                currentUser.setPassword(reqUser.getPassword());
            }

            currentUser = this.userRepository.save(currentUser);
        }
        return currentUser;
    }
    public boolean register(String email, String rawPassword, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            return false;
        }
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(encoder.encode(rawPassword));
        newUser.setName(name);
        userRepository.save(newUser);
        return true;
    }
    public User authenticateAndReturnUser(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (encoder.matches(rawPassword, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

}
