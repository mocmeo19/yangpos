# Ảnh quảng cáo trên màn hình khách

Ba ảnh được tạo bằng công cụ `image_gen` tích hợp (không dùng CLI/API), lưu tại `public/images/customer-display/`. Đây là hình minh họa quảng cáo cho quán.

Nội dung tiếng Việt và tên cửa hàng được hiển thị bằng HTML để giữ chữ rõ nét và dùng tên quán trong cài đặt. Chỉnh nội dung banner trong `src/data/customer-display-ads.ts`. Các banner tự chuyển sau 7 giây, không dùng dữ liệu hay giá món ăn từ thực đơn.

Banner khuyến mãi mời khách hỏi nhân viên về chương trình và điều kiện áp dụng; không tự đặt mức giảm giá, thời hạn hay cam kết ưu đãi.

## Prompt tạo ảnh

### restaurant-welcome.png

Use case: ads-marketing. Asset type: photorealistic background for a Vietnamese neighborhood restaurant advertising banner on a customer-facing POS display. Create one polished landscape 4:3 image, 1536x1152. Scene: an inviting contemporary Vietnamese restaurant interior with warm timber, woven pendant lamps, soft amber light, green plants and a beautifully set dining table in the upper-right and center of the scene. A small shared Vietnamese meal is part of the setting, not a catalog food close-up. Emphasize hospitality and atmosphere. Composition: wide editorial hospitality photography; the upper two-thirds contain the warm restaurant scene, the lower-left third has quiet dark wood and deep warm shadows with generous negative space for a headline added later in code. Keep essential elements in the central 80% so the image tolerates modest responsive cropping. Natural materials, authentic textures, refined welcoming mood. No people, no lettering, no text, no logos, no watermarks, no collage, no mockup frame.

### restaurant-offers.png

Use case: ads-marketing. Asset type: photorealistic promotional campaign background for a Vietnamese restaurant customer-facing POS screen. Create one polished landscape 4:3 image, 1536x1152. Scene: a tasteful restaurant promotion still life on a warm terracotta table, with a small kraft-paper gift box tied with burnt-orange fabric ribbon, two elegant blank cream voucher cards leaning against the box, ceramic tea cups and a subtle table setting. This is an advertising concept about restaurant offers and hospitality, not a menu dish photograph. Composition: premium editorial advertising photography; arrange the gift box and blank cards in the upper-right and center, keeping the lower-left third quiet with dark cinnamon shadows and negative space where HTML promotional text will be placed. Soft warm directional light, realistic paper grain and ribbon texture, restrained sophisticated celebration. Keep important objects within the central 80% for responsive crops. All voucher cards must be completely blank with no symbols or writing. No printed text, no numbers, no percent signs, no logos, no watermark, no collage, no mockup frame.

### restaurant-gathering.png

Use case: ads-marketing. Asset type: photorealistic lifestyle restaurant advertising background for a customer-facing POS display. Create one polished landscape 4:3 image, 1536x1152. Scene: a relaxed group of four Vietnamese adult friends sharing a meal in a cozy contemporary neighborhood Vietnamese restaurant. Candid natural smiles and conversation, welcoming warm light, timber and muted olive interior details. The shared meal is incidental; the main subject is togetherness and restaurant hospitality. Composition: slightly wide editorial lifestyle photograph, group and faces in the upper half and center-right, a softly out-of-focus table edge with warm dark shadows in the lower-left third providing generous negative space for HTML text to be added. Natural facial features, realistic hands, unposed gestures, no exaggerated expressions, cinematic but believable light. Keep all faces inside the central 80% for responsive cropping. No visible brands, no lettering, no text, no logos, no watermark, no collage, no mockup frame.
