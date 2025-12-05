CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'waiting' -- waiting, playing, finished
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    room_id VARCHAR(50) REFERENCES rooms(id),
    score INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    category VARCHAR(50) DEFAULT 'devops'
);

-- Seed words
INSERT INTO words (word) VALUES 
('Docker'), ('Kubernetes'), ('Pipeline'), ('Firewall'), 
('Latency'), ('Cloud'), ('Serverless'), ('Git'), 
('Merge Conflict'), ('Bug'), ('Feature'), ('Deploy'), 
('Rollback'), ('Sudo'), ('Linux'), ('Container'),
('Microservices'), ('Load Balancer'), ('DNS'), ('Encryption'),
('SSH'), ('Terminal'), ('Script'), ('Python'),
('Go'), ('Rust'), ('Java'), ('Node.js'),
('Database'), ('SQL'), ('NoSQL'), ('Cache'),
('Redis'), ('Kafka'), ('RabbitMQ'), ('Monitoring'),
('Logging'), ('Grafana'), ('Prometheus'), ('Terraform'),
('Ansible'), ('Jenkins'), ('GitLab'), ('GitHub'),
('Azure'), ('AWS'), ('GCP'), ('OpenShift'),
('Nginx'), ('Apache')
ON CONFLICT DO NOTHING;
