CREATE TABLE IF NOT EXISTS Roles(
    role_id INT(10) NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(25) NOT NULL,
    role_description TEXT,
    role_icon_url VARCHAR(255) NOT NULL,
    PRIMARY KEY(role_id)
);
CREATE TABLE IF NOT EXISTS Agents (
    agent_id INT(10) NOT NULL AUTO_INCREMENT,
    agent_name VARCHAR(50) NOT NULL,
    role_id INT(10) NOT NULL,
    description TEXT,
    portrait_image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (agent_id)
);
CREATE TABLE IF NOT EXISTS Abilities (
    ability_id INT(10) NOT NULL AUTO_INCREMENT,
    agent_id INT(10) NOT NULL,
    ability_name VARCHAR(50) NOT NULL,
    ability_type ENUM(
        'Signature_Ability',
        'Basic_Ability1',
        'Basic_Ability2',
        'Ultimate_Ability'
    ) NOT NULL,
    description TEXT,
    video_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (ability_id),
    FOREIGN KEY (agent_id) REFERENCES Agents(agent_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Weapons(
    weapon_id INT(10) NOT NULL AUTO_INCREMENT,
    weapon_name VARCHAR(25) NOT NULL,
    weapon_category ENUM(
        'Melee',
        'Sidearms',
        'SMGs',
        'Shotguns',
        'Rifles',
        'Sniper Rifles',
        'Machine Guns'
    ),
    cost INT,
    magazine_size INT NOT NULL,
    fire_rate DECIMAL(5, 2) NOT NULL,
    reload_speed DECIMAL(5, 2) NOT NULL,
    wall_penetration ENUM('Low', 'Medium', 'High') NOT NULL,
    weapon_image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY(weapon_id)
);
CREATE TABLE IF NOT EXISTS Weapon_Damage(
    damage_id INT(10) NOT NULL AUTO_INCREMENT,
    weapon_id INT(10) NOT NULL,
    range_start INT NOT NULL,  -- mét bắt đầu
    range_end INT NOT NULL, -- mét kết thúc
    head_damage DECIMAL(6, 2) NOT NULL,
    body_damage DECIMAL(6, 2) NOT NULL,
    leg_damage DECIMAL(6, 2) NOT NULL,
    PRIMARY KEY(damage_id),
    FOREIGN KEY(weapon_id) REFERENCES Weapons(weapon_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Maps(
    map_id INT NOT NULL AUTO_INCREMENT,
    map_name VARCHAR(25) NOT NULL,
    description TEXT,
    layout_image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY(map_id)
);
CREATE TABLE IF NOT EXISTS Guides(
    guide_id INT(10) NOT NULL AUTO_INCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(25) NOT NULL,
    created_at DATE DEFAULT NULL,
    map_id INT DEFAULT NULL,
    agent_id INT DEFAULT NULL,
    PRIMARY KEY(guide_id)
);
CREATE TABLE IF NOT EXISTS Team_Compositions (
    composition_id INT(10) NOT NULL AUTO_INCREMENT,
    map_id INT(10) NOT NULL,
    composition_name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (composition_id),
    FOREIGN KEY (map_id) REFERENCES Maps(map_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Composition_Agents(
    composition_id INT(10) NOT NULL,
    agent_id INT(10) NOT NULL,
    PRIMARY KEY(composition_id, agent_id),
    FOREIGN KEY(composition_id) REFERENCES Team_Compositions(composition_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(agent_id) REFERENCES Agents(agent_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Pages (
    page_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    category ENUM('Agent', 'Map', 'Weapon', 'Guide', 'Team_Composition') NOT NULL,
    linked_id INT NULL, -- tham chiếu đến id thực tế (ví dụ map_id)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Revisions (
    revision_id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    author VARCHAR(100),
    summary TEXT,
    content LONGTEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES Pages(page_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Foreign keys sẽ được tạo ở phần ALTER TABLE bên dưới
-- Script migrate.js sẽ tự động xóa foreign keys cũ trước khi chạy migration này
ALTER TABLE
    Agents ADD CONSTRAINT fk_agents_role FOREIGN KEY(role_id) REFERENCES Roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE
    Guides ADD CONSTRAINT fk_guides_map FOREIGN KEY(map_id) REFERENCES Maps(map_id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE
    Guides ADD CONSTRAINT fk_guides_agent FOREIGN KEY(agent_id) REFERENCES Agents(agent_id) ON DELETE SET NULL ON UPDATE CASCADE;

    CREATE TABLE IF NOT EXISTS Admin(
    admin_id INT(10) NOT NULL AUTO_INCREMENT,
    username VARCHAR(25) NOT NULL,
    `password` VARCHAR(25) NOT NULL,
    email VARCHAR(25) NOT NULL,
    phone INT(25) NOT NULL,
    quyen ENUM('admin', 'editor', 'viewer'),
    `date` DATE DEFAULT NULL,
    trangthai ENUM('active', 'disable') NOT NULL DEFAULT 'active',
    PRIMARY KEY(admin_id)
);

ALTER TABLE admin MODIFY password VARCHAR(255) NOT NULL;
ALTER TABLE admin MODIFY phone VARCHAR(15) NOT NULL;
ALTER TABLE admin 

MODIFY `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE admin ADD UNIQUE (username);
INSERT INTO weapons (weapon_id, weapon_name, weapon_category, cost, magazine_size, fire_rate, reload_speed, wall_penetration, weapon_image_url) VALUES
(1, 'Classic', 'Sidearms', 0, 12, 6.75, 1.75, 'Low', '/images/weapons/classic.png'),
(2, 'Shorty', 'Sidearms', 150, 2, 3.33, 1.75, 'Low', '/images/weapons/shorty.png'),
(3, 'Frenzy', 'Sidearms', 450, 13, 10.0, 1.0, 'Low', '/images/weapons/frenzy.png'),
(4, 'Ghost', 'Sidearms', 500, 15, 6.75, 1.5, 'Medium', '/images/weapons/ghost.png'),
(5, 'Sheriff', 'Sidearms', 800, 6, 4.0, 2.25, 'High', '/images/weapons/sheriff.png'),
(6, 'Stinger', 'SMGs', 950, 20, 16.0, 2.25, 'Low', '/images/weapons/stinger.png'),
(7, 'Spectre', 'SMGs', 1600, 30, 13.33, 2.25, 'Medium', '/images/weapons/spectre.png'),
(8, 'Bucky', 'Shotguns', 850, 5, 1.1, 2.5, 'Low', '/images/weapons/bucky.png'),
(9, 'Judge', 'Shotguns', 1850, 7, 3.5, 2.2, 'Medium', '/images/weapons/judge.png'),
(10, 'Bulldog', 'Rifles', 2050, 24, 9.15, 2.5, 'Medium', '/images/weapons/bulldog.png'),
(11, 'Guardian', 'Rifles', 2250, 12, 4.75, 2.5, 'High', '/images/weapons/guardian.png'),
(12, 'Phantom', 'Rifles', 2900, 30, 11.0, 2.5, 'Medium', '/images/weapons/phantom.png'),
(13, 'Vandal', 'Rifles', 2900, 25, 9.75, 2.5, 'Medium', '/images/weapons/vandal.png'),
(14, 'Marshal', 'Sniper Rifles', 950, 5, 1.5, 3.0, 'Medium', '/images/weapons/marshal.png'),
(15, 'Operator', 'Sniper Rifles', 4700, 5, 0.6, 3.7, 'High', '/images/weapons/operator.png'),
(16, 'Outlaw', 'Sniper Rifles', 2400, 2, 2.5, 2.5, 'High', '/images/weapons/outlaw.png'),
(17, 'Ares', 'Machine Guns', 1600, 50, 10.0, 3.5, 'High', '/images/weapons/ares.png'),
(18, 'Odin', 'Machine Guns', 3200, 100, 12.0, 5.0, 'High', '/images/weapons/odin.png');

INSERT INTO weapon_damage (weapon_id, range_start, range_end, head_damage, body_damage, leg_damage) VALUES
-- Sidearms
(1, 0, 30, 78, 26, 22), (1, 30, 50, 66, 22, 18), -- Classic
(2, 0, 7, 22, 11, 9), (2, 7, 15, 12, 6, 5), (2, 15, 50, 6, 3, 2), -- Shorty
(3, 0, 20, 78, 26, 22), (3, 20, 50, 63, 21, 17), -- Frenzy
(4, 0, 30, 105, 30, 25), (4, 30, 50, 87, 25, 21), -- Ghost
(5, 0, 30, 155, 55, 47), (5, 30, 50, 145, 50, 43), -- Sheriff

-- SMGs
(6, 0, 20, 67, 27, 23), (6, 20, 50, 57, 23, 20), -- Stinger
(7, 0, 20, 78, 26, 22), (7, 20, 50, 66, 22, 18), -- Spectre

-- Shotguns
(8, 0, 8, 40, 20, 17), (8, 8, 12, 28, 14, 12), (8, 12, 50, 18, 9, 8), -- Bucky
(9, 0, 10, 34, 17, 14), (9, 10, 15, 26, 13, 11), (9, 15, 50, 20, 10, 8), -- Judge

-- Rifles
(10, 0, 50, 115, 35, 30), -- Bulldog
(11, 0, 50, 195, 65, 49), -- Guardian
(12, 0, 15, 156, 39, 33), (12, 15, 30, 140, 35, 30), (12, 30, 50, 124, 31, 26), -- Phantom
(13, 0, 50, 160, 40, 34), -- Vandal

-- Snipers
(14, 0, 50, 202, 101, 85), -- Marshal
(15, 0, 50, 255, 150, 120), -- Operator
(16, 0, 50, 238, 140, 119), -- Outlaw

-- Heavies
(17, 0, 30, 72, 30, 25), (17, 30, 50, 67, 28, 23), -- Ares
(18, 0, 30, 95, 38, 32), (18, 30, 50, 77, 31, 26); -- Odin