package com.exam.Scheduler.service;

import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.*;

@Service
public class ColoringService {

    public Map<String, List<String>> colorGraph(Map<String, Set<String>> graph) {
        List<Vertex> vertices = convertGraph(graph);
        Collections.sort(vertices, new VertexComparator());

        Map<String, List<String>> colorGroups = new HashMap<>();
        Map<String, Boolean> colored = new HashMap<>();
        graph.keySet().forEach(v -> colored.put(v, false));

        for (Vertex vertex : vertices) {
            if (!colored.get(vertex.getName())) {
                List<String> group = new ArrayList<>();
                group.add(vertex.getName());
                colored.put(vertex.getName(), true);

                for (String v : graph.keySet()) {
                    if (!vertex.getNeighbors().contains(v) && !colored.get(v)) {
                        boolean canColor = group.stream().noneMatch(g -> graph.get(g).contains(v));
                        if (canColor) {
                            colored.put(v, true);
                            group.add(v);
                        }
                    }
                }
                colorGroups.put("Color" + (colorGroups.size() + 1), group);
            }
        }
        return colorGroups;
    }

    private List<Vertex> convertGraph(Map<String, Set<String>> graph) {
        List<Vertex> vertices = new ArrayList<>();
        graph.forEach((key, value) -> vertices.add(new Vertex(key, value)));
        return vertices;
    }
}

class Vertex {
    private String name;
    private Set<String> neighbors;

    public Vertex(String name, Set<String> neighbors) {
        this.name = name;
        this.neighbors = neighbors;
    }

    public String getName() { return name; }
    public Set<String> getNeighbors() { return neighbors; }
}

class VertexComparator implements Comparator<Vertex> {
    @Override
    public int compare(Vertex a, Vertex b) {
        return Integer.compare(b.getNeighbors().size(), a.getNeighbors().size());
    }
}

