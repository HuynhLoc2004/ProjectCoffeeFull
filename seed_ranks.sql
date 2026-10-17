-- Insert users
INSERT INTO user_account (id_user, account_user, user_active, date_user, email_user, fullname, password_user, phone_user, picture, provider, provider_id, address, create_at) 
VALUES 
(22, NULL, true, NULL, 'huynhtanlocpp09@gmail.com', 'Huỳnh Tấn Lộc', NULL, '0977958351', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400', 'GOOGLE', '102954401833197217473', 'Hồ Chí Minh', '2026-02-20 15:11:17.720'),
(24, 'loc123', true, '2026-01-07', 'huynhtanlocpp0212@gmail.com', 'Lê Minh Quân', '$2a$10$iOASlxOqotoks4c2YpRDqe2q1cs3qX7sSLRexv418pV0VDOMulQDq', '0986958350', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400', 'LOCAL', '2994fa64-4be3-425f-881b-a331737518e3', 'Quận 1, TP.HCM', '2026-02-20 15:11:17.720'),
(27, NULL, true, NULL, 'huynhtanlocpp0912123@gmail.com', 'Trần Thảo Vy', NULL, '0984958350', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400', 'GOOGLE', '112088320237223575997', 'Bình Thạnh, TP.HCM', '2026-02-20 15:11:17.720'),
(28, 'loc11', true, '2026-01-07', 'huynhtanlocpp1109@gmail.com', 'Nguyễn Gia Hưng', '$2a$10$lXohqRyKRPGcPcG3nUa4oepVeTUR3LOhKpimbl.nm3Ai7ZaBmT2Jy', '0981213143', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400', 'LOCAL', '7a4e4988-cc23-4863-921d-9ef7d91e573f', 'Thủ Đức, TP.HCM', '2026-02-20 15:11:17.720'),
(29, 'loc0909', true, '2026-02-09', 'huynhtanlocpp12409@gmail.com', 'Phạm Hoàng Nam', '$2a$10$e87WXK4Z/X3ZEkxfxYJ8TuXAhrrn1dDtyEGLO.OmYwx47Ti0jcFF2', '0974323141', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400', 'LOCAL', 'f4ba7c6b-41b2-4fa3-93e3-c297fbf04099', 'Quận 3, TP.HCM', '2026-03-05 15:11:17.720'),
(30, NULL, true, NULL, 'huynhloc27102004@gmail.com', 'Đỗ Mai Linh', NULL, '0974323999', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400', 'GOOGLE', '112088320237223575998', 'Quận 7, TP.HCM', '2026-03-23 11:58:28.627')
ON CONFLICT (id_user) DO UPDATE 
SET fullname = EXCLUDED.fullname, picture = EXCLUDED.picture, phone_user = EXCLUDED.phone_user;

-- Insert user_role
INSERT INTO user_role (id_user, id_role) VALUES 
(22, 2), (24, 2), (27, 2), (28, 2), (29, 2), (30, 2)
ON CONFLICT DO NOTHING;

-- Insert orders_history with realistic coffee order totals
INSERT INTO orders_history (order_history_id, total_price, order_entity_order_id, user_id, time_order_history, status)
VALUES
(1149, 1250000, 260227114913521, 22, '2026-02-27 11:49:31', 'PAID'),
(1150, 950000, 260227114947226, 22, '2026-02-27 11:49:59', 'PAID'),
(1160, 850000, 260228181650439, 24, '2026-02-28 18:17:07', 'PAID'),
(1163, 620000, 260302105038389, 27, '2026-03-02 10:51:01', 'PAID'),
(1167, 450000, 260303204631852, 28, '2026-03-03 20:46:47', 'PAID'),
(1175, 320000, 260305145904896, 29, '2026-03-05 14:59:15', 'PAID'),
(1193, 210000, 260404215340617, 30, '2026-04-04 21:56:35', 'PAID')
ON CONFLICT (order_history_id) DO UPDATE 
SET total_price = EXCLUDED.total_price, status = EXCLUDED.status;
