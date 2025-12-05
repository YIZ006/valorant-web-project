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
INSERT INTO weapons (weapon_id, weapon_name, weapon_category, cost, magazine_size, wall_penetration) VALUES
(1, 'Classic', 'Sidearm', 0, 12, 'Low'),
(2, 'Shorty', 'Sidearm', 150, 2, 'Low'),
(3, 'Frenzy', 'Sidearm', 450, 13, 'Low'),
(4, 'Ghost', 'Sidearm', 500, 15, 'Medium'),
(5, 'Sheriff', 'Sidearm', 800, 6, 'High'),
(6, 'Stinger', 'SMG', 950, 20, 'Low'),
(7, 'Spectre', 'SMG', 1600, 30, 'Medium'),
(8, 'Bucky', 'Shotgun', 850, 5, 'Low'),
(9, 'Judge', 'Shotgun', 1850, 7, 'Medium'),
(10, 'Bulldog', 'Rifle', 2050, 24, 'Medium'),
(11, 'Guardian', 'Rifle', 2250, 12, 'High'),
(12, 'Phantom', 'Rifle', 2900, 30, 'Medium'),
(13, 'Vandal', 'Rifle', 2900, 25, 'Medium'),
(14, 'Marshal', 'Sniper', 950, 5, 'Medium'),
(15, 'Operator', 'Sniper', 4700, 5, 'High'),
(16, 'Outlaw', 'Sniper', 2400, 2, 'High'),
(17, 'Ares', 'Heavy', 1600, 50, 'High'),
(18, 'Odin', 'Heavy', 3200, 100, 'High');

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