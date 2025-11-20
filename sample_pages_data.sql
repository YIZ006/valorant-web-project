-- Script tạo dữ liệu mẫu cho bảng Pages
-- Chạy script này sau khi đã tạo xong database

-- Thêm các trang Map vào bảng Pages
INSERT INTO Pages (title, slug, content, category, linked_id) VALUES
('Ascent', 'ascent', 
'<h2>Ascent</h2>
<p><strong>Mô tả:</strong> An open playground for small wars of position and attrition divide two sites on Ascent. Each site can be fortified by irreversible bomb doors; once they''re down, you''ll have to destroy them or find another way.</p>

<h3>Thông tin cơ bản:</h3>
<ul>
<li><strong>Số site:</strong> 2 (A và B)</li>
<li><strong>Đặc điểm:</strong> Có cửa bom không thể đảo ngược</li>
<li><strong>Phong cách:</strong> Chiến đấu vị trí và tiêu hao</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Ascent là một bản đồ cân bằng với nhiều góc bắn và vị trí chiến thuật. Việc kiểm soát mid là rất quan trọng để có thể rotate nhanh giữa các site.</p>

<h3>Đội hình khuyến nghị:</h3>
<ul>
<li>Duelist: Jett, Reyna</li>
<li>Controller: Omen, Viper</li>
<li>Initiator: Sova, Breach</li>
<li>Sentinel: Cypher, Killjoy</li>
</ul>', 
'Map', 1),

('Haven', 'haven', 
'<h2>Haven</h2>
<p><strong>Mô tả:</strong> Three-site map (A/B/C) — more complex rotation, emphasises rotations and control of mid/links.</p>

<h3>Thông tin cơ bản:</h3>
<ul>
<li><strong>Số site:</strong> 3 (A, B và C)</li>
<li><strong>Đặc điểm:</strong> Bản đồ duy nhất có 3 site</li>
<li><strong>Phong cách:</strong> Rotate phức tạp, kiểm soát mid</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Haven yêu cầu chiến thuật phức tạp hơn do có 3 site. Việc kiểm soát mid và các link giữa các site là chìa khóa để thành công.</p>

<h3>Đội hình khuyến nghị:</h3>
<ul>
<li>Duelist: Phoenix, Raze</li>
<li>Controller: Brimstone, Omen</li>
<li>Initiator: Skye, KAY/O</li>
<li>Sentinel: Sage, Chamber</li>
</ul>', 
'Map', 2),

('Icebox', 'icebox', 
'<h2>Icebox</h2>
<p><strong>Mô tả:</strong> Map set in an arctic excavation with two plant sites, ziplines, verticality and long sight-lines.</p>

<h3>Thông tin cơ bản:</h3>
<ul>
<li><strong>Số site:</strong> 2 (A và B)</li>
<li><strong>Đặc điểm:</strong> Ziplines, chiều cao, tầm nhìn xa</li>
<li><strong>Phong cách:</strong> Chiến đấu theo chiều dọc</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Icebox có nhiều góc bắn từ trên cao và ziplines cho phép di chuyển nhanh. Việc kiểm soát các vị trí cao là rất quan trọng.</p>

<h3>Đội hình khuyến nghị:</h3>
<ul>
<li>Duelist: Jett, Neon</li>
<li>Controller: Viper, Harbor</li>
<li>Initiator: Sova, Fade</li>
<li>Sentinel: Sage, Chamber</li>
</ul>', 
'Map', 3),

('Lotus', 'lotus', 
'<h2>Lotus</h2>
<p><strong>Mô tả:</strong> A mysterious structure housing an astral conduit radiates with ancient power. Great stone doors provide a variety of movement opportunities and unlock the paths to three mysterious sites.</p>

<h3>Thông tin cơ bản:</h3>
<ul>
<li><strong>Số site:</strong> 3 (A, B và C)</li>
<li><strong>Đặc điểm:</strong> Cửa đá lớn, cơ chế di chuyển đặc biệt</li>
<li><strong>Phong cách:</strong> Chiến đấu với cơ chế độc đáo</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Lotus có các cơ chế độc đáo với cửa đá và các đường di chuyển đặc biệt. Việc hiểu và tận dụng các cơ chế này là chìa khóa thành công.</p>

<h3>Đội hình khuyến nghị:</h3>
<ul>
<li>Duelist: Raze, Yoru</li>
<li>Controller: Astra, Omen</li>
<li>Initiator: Breach, KAY/O</li>
<li>Sentinel: Killjoy, Cypher</li>
</ul>', 
'Map', 4),

('Pearl', 'pearl', 
'<h2>Pearl</h2>
<p><strong>Mô tả:</strong> Two-site map set in a vibrant underwater city. Attackers push down into the Defenders on this two-site map.</p>

<h3>Thông tin cơ bản:</h3>
<ul>
<li><strong>Số site:</strong> 2 (A và B)</li>
<li><strong>Đặc điểm:</strong> Thành phố dưới nước, góc bắn từ trên xuống</li>
<li><strong>Phong cách:</strong> Attackers tấn công từ trên cao</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Pearl có thiết kế độc đáo với việc attackers tấn công từ trên cao xuống defenders. Việc kiểm soát các vị trí cao và góc bắn là rất quan trọng.</p>

<h3>Đội hình khuyến nghị:</h3>
<ul>
<li>Duelist: Jett, Neon</li>
<li>Controller: Harbor, Viper</li>
<li>Initiator: Sova, Fade</li>
<li>Sentinel: Chamber, Killjoy</li>
</ul>', 
'Map', 5),

('Split', 'split', 
'<h2>Split</h2>
<p><strong>Mô tả:</strong> Two-site map with strong vertical elements, ropes, high ground fights.</p>

<h3>Thông tin cơ bản:</h3>
<ul>
<li><strong>Số site:</strong> 2 (A và B)</li>
<li><strong>Đặc điểm:</strong> Yếu tố chiều cao mạnh, dây thừng</li>
<li><strong>Phong cách:</strong> Chiến đấu trên cao</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Split có nhiều vị trí cao và dây thừng để di chuyển. Việc kiểm soát các vị trí cao và sử dụng dây thừng hiệu quả là chìa khóa thành công.</p>

<h3>Đội hình khuyến nghị:</h3>
<ul>
<li>Duelist: Jett, Raze</li>
<li>Controller: Omen, Brimstone</li>
<li>Initiator: Sova, Skye</li>
<li>Sentinel: Sage, Cypher</li>
</ul>', 
'Map', 6),

('Sunset', 'sunset', 
'<h2>Sunset</h2>
<p><strong>Mô tả:</strong> Traditional three-lane layout with two spike sites, mechanical doors reminiscent of Ascent.</p>

<h3>Thông tin cơ bản:</h3>
<ul>
<li><strong>Số site:</strong> 2 (A và B)</li>
<li><strong>Đặc điểm:</strong> Layout 3 lane truyền thống, cửa cơ khí</li>
<li><strong>Phong cách:</strong> Giống Ascent với cửa cơ khí</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Sunset có layout quen thuộc với 3 lane và cửa cơ khí giống Ascent. Việc kiểm soát mid và sử dụng cửa cơ khí hiệu quả là quan trọng.</p>

<h3>Đội hình khuyến nghị:</h3>
<ul>
<li>Duelist: Reyna, Phoenix</li>
<li>Controller: Omen, Viper</li>
<li>Initiator: Breach, KAY/O</li>
<li>Sentinel: Cypher, Killjoy</li>
</ul>', 
'Map', 7);

-- Thêm một số trang Agent mẫu
INSERT INTO Pages (title, slug, content, category, linked_id) VALUES
('Jett', 'jett', 
'<h2>Jett</h2>
<p><strong>Vai trò:</strong> Duelist</p>
<p><strong>Mô tả:</strong> Jett là một Duelist nhanh nhẹn với khả năng di chuyển linh hoạt và tấn công từ các góc độ bất ngờ.</p>

<h3>Kỹ năng:</h3>
<ul>
<li><strong>Cloudburst (C):</strong> Tạo đám mây khói để che giấu</li>
<li><strong>Updraft (Q):</strong> Nhảy lên cao</li>
<li><strong>Tailwind (E):</strong> Dash nhanh về phía trước</li>
<li><strong>Blade Storm (X):</strong> Ultimate - 5 con dao có thể thu hồi</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Jett phù hợp với phong cách aggressive, entry fragging và tạo áp lực cho đối thủ. Sử dụng Updraft và Tailwind để tạo góc bắn bất ngờ.</p>', 
'Agent', 1),

('Sage', 'sage', 
'<h2>Sage</h2>
<p><strong>Vai trò:</strong> Sentinel</p>
<p><strong>Mô tả:</strong> Sage là một Sentinel với khả năng hỗ trợ đội bằng cách heal và revive đồng đội.</p>

<h3>Kỹ năng:</h3>
<ul>
<li><strong>Slow Orb (C):</strong> Tạo vùng làm chậm đối thủ</li>
<li><strong>Healing Orb (Q):</strong> Hồi máu cho bản thân hoặc đồng đội</li>
<li><strong>Barrier Orb (E):</strong> Tạo bức tường chắn</li>
<li><strong>Resurrection (X):</strong> Ultimate - Hồi sinh đồng đội</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Sage là agent hỗ trợ quan trọng, tập trung vào việc giữ site và hỗ trợ đồng đội. Sử dụng Barrier Orb để chặn đường và Slow Orb để làm chậm đối thủ.</p>', 
'Agent', 2);

-- Thêm một số trang Weapon mẫu
INSERT INTO Pages (title, slug, content, category, linked_id) VALUES
('Vandal', 'vandal', 
'<h2>Vandal</h2>
<p><strong>Loại:</strong> Rifle</p>
<p><strong>Giá:</strong> 2900 credits</p>
<p><strong>Mô tả:</strong> Vandal là một trong những rifle mạnh nhất trong game với sát thương cao và độ chính xác tốt.</p>

<h3>Thông số:</h3>
<ul>
<li><strong>Kích cỡ đạn:</strong> 25 viên</li>
<li><strong>Tốc độ bắn:</strong> 9.25 rounds/sec</li>
<li><strong>Tốc độ reload:</strong> 2.5 giây</li>
<li><strong>Xuyên thủng:</strong> Medium</li>
</ul>

<h3>Sát thương:</h3>
<ul>
<li><strong>Đầu:</strong> 160 damage</li>
<li><strong>Thân:</strong> 40 damage</li>
<li><strong>Chân:</strong> 34 damage</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Vandal phù hợp với phong cách aggressive và long-range combat. Sát thương cao giúp có thể one-tap headshot ở mọi khoảng cách.</p>', 
'Weapon', 13),

('Phantom', 'phantom', 
'<h2>Phantom</h2>
<p><strong>Loại:</strong> Rifle</p>
<p><strong>Giá:</strong> 2900 credits</p>
<p><strong>Mô tả:</strong> Phantom là rifle cân bằng với tốc độ bắn cao và khả năng kiểm soát tốt.</p>

<h3>Thông số:</h3>
<ul>
<li><strong>Kích cỡ đạn:</strong> 30 viên</li>
<li><strong>Tốc độ bắn:</strong> 11 rounds/sec</li>
<li><strong>Tốc độ reload:</strong> 2.5 giây</li>
<li><strong>Xuyên thủng:</strong> Medium</li>
</ul>

<h3>Sát thương:</h3>
<ul>
<li><strong>Đầu (0-15m):</strong> 156 damage</li>
<li><strong>Đầu (15-30m):</strong> 140 damage</li>
<li><strong>Đầu (30m+):</strong> 124 damage</li>
<li><strong>Thân:</strong> 39/35/31 damage</li>
<li><strong>Chân:</strong> 33/30/26 damage</li>
</ul>

<h3>Chiến thuật:</h3>
<p>Phantom phù hợp với phong cách spray và close-to-medium range combat. Tốc độ bắn cao và ít recoil giúp kiểm soát dễ dàng.</p>', 
'Weapon', 12);
