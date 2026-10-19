import json

R_HCH_TOYS = {"title": "How to buy safe toys (HealthyChildren.org)", "url": "https://www.healthychildren.org/English/safety-prevention/at-home/Pages/How-to-Buy-Safe-Toys.aspx"}
R_HCH_CHOKE = {"title": "Choking prevention (HealthyChildren.org)", "url": "https://www.healthychildren.org/English/health-issues/conditions/choking/Pages/Choking-Prevention.aspx"}
R_CDC_KID = {"title": "Child development basics (CDC)", "url": "https://www.cdc.gov/ncbddd/childdevelopment/facts.html"}
R_NHS_PLAY = {"title": "Play ideas with your baby (NHS)", "url": "https://www.nhs.uk/conditions/baby/babys-development/play-ideas/"}
R_NHS_TEETH = {"title": "Teething tips and tooth care (NHS)", "url": "https://www.nhs.uk/conditions/baby/babys-teeth/teething-and-tooth-care/"}
R_ZTT_BRAIN = {"title": "Brain-building through play (ZERO TO THREE)", "url": "https://zerotothree.org/resource/brains-building-blocks-ways-to-boost-your-babys-brain-development/"}
R_WHO_PLAY = {"title": "Improving early childhood development (WHO)", "url": "https://www.who.int/news-room/fact-sheets/detail/improving-early-childhood-development-who-guideline"}
R_AMI = {"title": "Montessori materials overview (AMI USA)", "url": "https://amiusa.org/montessori-classroom-materials/"}
R_MONTE_NOTEBOOK = {"title": "Montessori Notebook activities page", "url": "https://www.themontessorinotebook.com/montessori-activities/"}
R_CPS = {"title": "Toy safety tips (Canada Safety / general toy guidance)", "url": "https://www.cps.ca/en/documents/position/toys"}

materials = []


def add(mid, name, purpose, age, budget, diy, notes, refs, hint=None):
    m = {
        "id": mid,
        "name": name,
        "purpose": purpose,
        "ageBands": age,
        "budget": budget,
        "diy": diy,
        "safetyNotes": notes,
        "references": refs,
    }
    if hint:
        m["buyHint"] = hint
    materials.append(m)


add(
    "munari-mobile", "Munari Mobile (mobile hitam-putih)",
    "Mobile hitam-putih dengan lingkaran dan bentuk geometris sederhana yang boleh diletakkan di atas area pandang bayi saat terjaga. Bayi muda umumnya lebih menarik melihat kontras tinggi, dan mobile ini melatih mata untuk memusatkan pandangan serta mengikuti objek yang bergoyang pelan.",
    ["0-3m", "3-6m"], "sedang", True,
    ["Jangan pernah menggantung mobile di atas kasur tempat bayi tidur; pilih permukaan yang tegas seperti strip kayu atau pengait langit-langit yang kokoh. Jarak idealnya sekitar 25-30 cm dari wajah bayi dan bayi selalu dalam kawalan orang dewasa."],
    [R_HCH_TOYS],
    "Dapat dibeli dari penjual mobile handmade lokal atau dibuat sendiri dari kertas karton hitam dan putih dengan kerangka benang kaku.",
)
add(
    "octahedron-mobile", "Octahedron Mobile (mobile tiga oktahedron mengkilap)",
    "Tiga bentuk oktahedron kecil dari kertas mengkilap warna emas, perak, dan putih yang digantung berjajar. Ketika cahaya mengenainya, permukaan mengilapnya memantulkan warna lembut sehingga mata bayi berlatih mengikuti pantulan serta berkenalan dengan warna-warna halus pertamanya.",
    ["0-3m", "3-6m"], "sedang", True,
    ["Pastikan ikatan benang sangat kuat dan tidak bisa dijangkau tangan bayi. Sesegera mungkin begitu bayi mulai mengayunkan tangan ke arah mobile, pindahkan mobile ke locasi yang tetap aman atau tukar dengan mainan yang boleh dipegang."],
    [R_CDC_KID],
    "Cari dengan kata kunci 'octahedron mobile baby' di marketplace lokal, atau buat versi sederhana dengan kertas origami mengkilap.",
)
add(
    "gobbi-mobile", "Gobbi Mobile (mobile gradasi warna bola-bola)",
    "Mobile berisi lima bola kecil berselaput benang dari satu keluarga warna, digantung pada ketinggian berbeda sehingga membentuk gradasi. Bayi berlatih mengamati perbedaan warna yang sangat mirip dan menikmati pergerakan yang menenangkan.",
    ["0-3m", "3-6m"], "sedang", True,
    ["Bola dan benang harus terpasang rapat supaya tidak ada bagian yang mudah lepas. Pasang hanya saat bayi terjaga dan diawasi, serta sesuaikan tingginya agar benang tidak mungkin sampai ke mulut bayi."],
    [R_CDC_KID],
    "Banyak penjual handmade lokal menjual set mobile bayi; pilih versi dengan bola tetap dari bahan tidak mudah bergaru.",
)
add(
    "tactile-ribbon-ring", "Cincin dengan pita-pita kecil (dancing ribbons ring)",
    "Cincin kayu atau cincin plastik aman yang diikatkan sejumlah pita pendek dari kain atau pita dekorasi. Saat bayi memegang dan menggoyangkannya, pita beribaran pelan sehingga bayi menghubungkan gerakan tangannya sendiri dengan hasil visual yang berubah.",
    ["3-6m", "6-9m"], "rendah", True,
    ["Setiap pita harus pendek (maksimal sekitar 10 cm) dan dijahit atau diikatan kuat ke cincin agar tidak lepas menggantung di jari. Berikan hanya saat bayi duduk bersama orang dewasa dan tidak sedang lelah."],
    [R_ZTT_BRAIN],
    "Bisa dibuat sendiri dari cincin gantungan gorden kayu yang bersih dan pita kain yang dicuci.",
)
add(
    "grasping-beads", "Grasping Beads (untai tiga manik besar)",
    "Tiga manik kayu besar disambung dengan tali kuat membentuk satu untai. Bayi berlatih mengenggam untai itu dengan satu tangan, kemudian memindahkannya ke tangan lain. Bentuk lonjongnya yang продаjut luas membuat lubang genggaman bayi mencoba posisi tangan yang berbeda-beda.",
    ["3-6m", "6-9m"], "rendah", False,
    ["Setiap manik harus sangat besar, jauh melebihi ukuran tabung gulungan kertas toilet, dan ikatan antar manik harus begitu kuat sehingga mustahil terpisah. Selalu periksa untai sebelum dipakai dan gunakan hanya dengan kawalan orang dewasa."],
    [R_HCH_CHOKE],
    "Tersedia di toko mainan alami sebagai 'grasping beads' atau 'triangular grasping beads' versi kayu aman anak.",
)
add(
    "interlocking-discs", "Interlocking Discs (dua cakram saling terkunci)",
    "Dua cakram kayu atau silikon yang masing-masing memiliki potongan yang cocok agar bisa saling terkunci seperti pisau gunting. Bentuknya menuntut bayi memutar pergelangan tangan dan memindah benda antar tangan, keterampilan dasar untuk memegang sendok dan cangkir nanti.",
    ["3-6m", "6-9m"], "rendah", True,
    ["Pilih diameter cakram yang lebih besar dari tabung gulungan kertas toilet dan pastikan permukaannya halus tanpa serpihan. Bayi tetap didampingi saat bermain agar tidak menempelkan benda ke mulut dalam waktu lama."],
    [R_HCH_TOYS],
    "Ada versi kayu di penjual mainan Montessori lokal dan versi silikon di toko bayi; keduanya biasanya diberi label aman untuk menggigit.",
)
add(
    "teether-ring", "Teether cincin kayu atau silikon",
    "Cincin teether berbahan aman yang nyaman digenggam dan lama-lama menjadi favorit bayi ketika gusi terasa gatal. Kebiasaan menggigit benda aman ini umumnya menolong banyak anak melewati masa tumbuh gigi dengan lebih tenang.",
    ["3-6m", "6-9m"], "rendah", False,
    ["Periksa teether setiap kali sebelum dipakai supaya tidak ada celah atau retakan yang bisa lepas ke mulut. Jangan pernah memasang teether pada tali panjang di leher atau pergelangan bayi, dan bersihkan secara rutin."],
    [R_NHS_TEETH],
    "Pilih teether satu bagian utuh atau yang bagian-bagiannya tersambung rapat; cek label produk yang menyatakan aman untuk bayi.",
)
add(
    "bell-cylinder", "Kaleng lonceng (bell cylinder rattle)",
    "Tabung kecil dengan genggaman yang di dalamnya terdapat lonceng berbunyi riang. Setiap kali tangan bayi bergerak, bunyi halus muncul, sehingga bayi belajar bahwa tubuhnya dapat menghasilkan suara dan telinganya berlatih mencari sumber bunyi.",
    ["3-6m", "6-9m"], "sedang", True,
    ["Tabung harus tertutup rapat sehingga lonceng tidak mungkin keluar dan tertelan. Pastikan panjang dan diameternya membuat tabung tidak bisa masuk ke mulut bayi, dan gunakan di bawah pengawasan orang dewasa."],
    [R_CDC_KID],
    "Cari 'bell cylinder Montessori' atau rattle logam bayi dengan label aman dan sambungan yang teruji.",
)
add(
    "wooden-rattle", "Rattle kayu sederhana",
    "Rattle ringan dengan genggaman bulat dan bunyi gemerlap lembut saat diguncang. Bayi yang mulai sengaja menggerakkan tangannya akan menemukan hubungan sebab-akibat sederhana dan menikmati suara yang muncul dari usahanya sendiri.",
    ["3-6m", "6-9m"], "rendah", False,
    ["Pilih rattle tanpa sudut tajam dan dengan bagian tengah yang cukup tipis untuk genggaman bayi namun keseluruhannya tidak bisa masuk ke mulut. Berpindah mainan cepat dengan perputaran rattle kecil sering membuat bayi asing; awasi setiap saat."],
    [R_HCH_TOYS],
    "Sangat mudah ditemukan dengan kata kunci 'rattle kayu bayi'; pilih yang catnya menyatakan aman untuk anak.",
)
add(
    "object-permanence-box", "Kotak objek permanen dengan bola",
    "Kotak kayu dengan lubang di atas dan bola kecil berbahan aman. Saat anak memasukkan bola, bola itu menghilang sebentar lalu muncul lagi di laci atau depan kotak. Banyak anak tertawa gembira setiap bola muncul kembali; di balik itu, anak mulai memahami bahwa benda tetap ada walau tidak terlihat.",
    ["9-12m", "12-18m"], "sedang", True,
    ["Ukuran bola harus atas ratusan pikul, jelas lebih besar dari tabung gulungan kertas toilet agar tidak bisa tertelan. Gunakan di lantai dengan anak duduk tersekrete orang dewasa, dan hindari kotak yang punya pegas kuat yang bisa menjepit jari."],
    [R_CDC_KID],
    "Tersedia di banyak toko mainan Montessori; pilih yang pintu laci mudah ditarik anak dan tanpa baut kecil yang lepas.",
)
add(
    "egg-and-cup", "Egg and Cup (kosong kayak telur dan cangkir)",
    "Sepasang benda kayu kecil berbentuk cangkir dan telur yang ditumbuhi cangkir itu. Anak belajar mengangkat telur dengan dua tangan lalu menempatkannya dengan cermat di dalam cangkir, keterampilan awal sebelum anak mengenal puzzle atau memasang barang kecil ke lubang.",
    ["9-12m", "12-18m"], "sedang", True,
    ["Bagian telur harus terlalu besar untuk masuk ke mulut balita. Gunakan di permukaan datar dan duduk bersama anak agar tidak ada bagian yang terlempar bila anak melemparkannya saat tugasan belum berhasil."],
    [R_ZTT_BRAIN],
    "Cari 'egg and cup Montessori'; versi tiga tingkat tersedia kalau ingin melanjutkan ke tingkat yang lebih menantang.",
)
add(
    "single-shape-puzzle", "Puzzle satu bentuk (lingkaran, persegi, segitiga, trapesium)",
    "Papan kayu dengan satu lubang bentuk dan satu keping besar bergagang yang cocok dengan bentuk itu. Anak berlatih mengangkat keping dengan pegangan tiga jari lalu mengujanya ke lubang, pengalaman pertama yang memperlihatkan bahwa bentuk memiliki tepi dan ujung yang khas.",
    ["12-18m", "18-24m"], "sedang", True,
    ["Kepingan harus cukup besar dengan gagang yang rapat dan tidak mudah lepas. Duduk bersama anak saat bermain karena balita sesekali melempar keping yang gagal masuk, dan periksa permukaan kayu agar tetap halus."],
    [R_CDC_KID],
    "Cari 'single shape puzzle' atau 'circle square triangle puzzle' di toko mainan Montessori lokal maupun online.",
)
add(
    "peg-puzzle-objects", "Puzzle peg dengan gambar benda sehari-hari",
    "Papan dengan beberapa keping bergagang yang masing-masing berisi gambar buah, hewan, atau kendaraan. Anak mengenali gambar sambil melatih tangan mengangkat dan menempatkan keping sesuai bayangan bentuknya, juga memperkaya kosakata saat orang tua menyebutkan namanya.",
    ["12-18m", "18-24m", "2-3y"], "sedang", False,
    ["Pilih keping yang lebih besar dari leher tabung gulungan kertas toilet dan gagangan yang tidak mudah lepas. Awasi agar keping tidak dipasukkan ke mulut atau dilempar saat anak mulai kesal."],
    [R_HCH_TOYS],
    "Tersedia di banyak toko mainan generik dengan tema macam-macam; pilih yang gambar jelas dan keping tidak tipis.",
)
add(
    "stacking-cups", "Cangkir susun (stacking cups)",
    "Satu set cangkir kecil dengan ukuran bertingkat yang bisa disusun, ditumpuk, dimasukkan satu sama lain, dipakai untuk menuang kering halus, bahkan diajak ke wajah saat mandi. Banyak anak memainkan cangkir ini dengan cara yang berbeda setiap bulannya seiring berkembangnya kecerdasannya.",
    ["9-12m", "12-18m", "18-24m", "2-3y"], "rendah", False,
    ["Cek tepi cangkir agar tidak ada celah yang bisa menggores kulit, dan gunakan di area bermain yang rapi. Bersihkan cangkir secara rutin karena dexing-nya mudah menyimpan air hangat yang bisa menjadi sarang mikroba."],
    [R_NHS_PLAY],
    "Set cangkir susun hijang dengan berbagai warna mudah ditemukan di toko bayi; versi silikon lebih baik untuk anak yang senang menggigit.",
)
add(
    "stacking-rings", "Cincin susun (stacking rings)",
    "Tiang dengan cincin berwarna dari ukuran besar ke kecil yang dilarik ke atas. Anak berlatih membedakan ukuran dengan mata dan tangan, mengatur urutan dari besar ke kecil, dan menunggu kesempatan agar cincin yang lebih kecil dapat ditumpuk di atas yang lebih besar.",
    ["12-18m", "18-24m", "2-3y"], "rendah", False,
    ["Cincin terkecil harus tetap jauh lebih besar dari tabung gulungan kertas toilet. Gunakan di lantai dan pilih tiang yang tidak terlalu tinggi agar menara tidak mudah roboh menghantam wajah anak."],
    [R_HCH_TOYS],
    "Tersedia versi kayu maupun plastik aman; pastikan tiangnya memiliki top yang tidak bisa lepas menjadi benda kecil.",
)
add(
    "nesting-boxes", "Kotak bersarang berukuran bertingkat (nesting boxes)",
    "Serangkaian kotak yang satu lebih besar dari lainnya sehingga bisa saling diselipkan. anak memindahkan kotak satu per satu, membuka dan menutupinya, kemudian menempatkan yang kecil ke dalam yang besar, menangkap hubungan ukuran secara alami sebelum mengenal ukuran dalam matematika.",
    ["12-18m", "18-24m", "2-3y"], "sedang", True,
    ["Pastikan tepi kotak tidak tajam dan bagian tetingkap atau atap kotak tidak bisa menjepit jari. Gunakan di lantai dan dampingi anak agar pelukan kotak yang besar tidak diangkat ke atas kepala."],
    [R_ZTT_BRAIN],
    "Kalau tidak ada versi khusus, gunakan sepasang kotak kardus dengan ukuran berbeda atau mangkuk plastik yang bersih bertingkat.",
)
add(
    "cylinder-blocks", "Cylinder blocks (blok silinder)",
    "Empat blok kayu yang masing-masing punya sepuluh silinder dengan tinggi atau lebar berbeda yang setiap satu cocok dengan satu cekungan di blok. Anak menangani silinder dengan pegangan tiga jari, pengalaman yang menghidupkan otot-otot yang nantinya dipakai ketika memegang pensil.",
    ["2-3y", "3-4y", "4-5y"], "tinggi", False,
    ["Silinder beralur berukuran kecil bisa masuk ke mulut anak yang lebih muda. Gunakan di lantai bersama anak dan simpan pada rak tinggi setelah bermain agar tidak diambil balita yang masih suka menuang benda ke mulut."],
    [R_AMI],
    "Biasanya dijual sebagai set; bila harga tinggi, mulai dari satu blok, atau gunakan alternatif seperti wadah bumbu dan tongkat es krim berbeda ukuran.",
)
add(
    "pink-tower", "Pink tower (menara kubus besar-kecil)",
    "Sepuluh kubus kayu berukuran bertingkat dari yang terkecil sampai yang terbesar. Anak membawa satu per satu kubus, menyusunnya dari besar di bawah hingga kecil di atas, mengamati perbedaan ukuran yang kian kecil, dan berlatih suka meluruskan sendiri bila menaranya miring.",
    ["2-3y", "3-4y"], "tinggi", True,
    ["Kubus terbesar cukup berat; ajarkan anak mengangkatnya dengan dua tangan dan menaruhnya pelan di lantai. Kubus terkecil harus jauh lebih besar dari mulut anak yang masih suka menyimpan benda ke mulutnya."],
    [R_AMI],
    "Tersedia versi kayu murah dan versi dari kayu pelangi kalau ingin menyentuh warna-warni; pastikan kubus berbahan kayu asli yang halus.",
)
add(
    "brown-stair", "Brown stair (tangga prisma cokelat)",
    "Sepuluh prisma kayu yang panjang dan tingginya merata dari kecil ke besar. Anak menyusun prisma berjajar sehingga membentuk tangga, melatih mata menilai perbedaan dimensi secara bertahap dan tangan membawa benda berat dengan hati-hati.",
    ["2-3y", "3-4y", "4-5y"], "tinggi", True,
    ["Prisma terbesar lumayan berat; dampingi anak saat menyusunnya di lantai dan hindari menumpuk prisma tinggi yang bisa roboh. Prisma terkecil harus aman ukurannya untuk anak yang menaruh benda ke mulut."],
    [R_AMI],
    "Biasanya dijual sebagai set terpisah atau disertai pink tower; kalau tidak ada, susun balok kayu berukuran berbeda pada area bermain.",
)
add(
    "knobbed-cylinders", "Knobbed cylinders (silinder bergagang tanpa cekungan terpisah)",
    "Sepuluh silinder bergagang yang berderet dalam satu bingkai kayu dengan variasi uang tinggi atau lebar yang anak mencocokkan ke lubang bingkai itu sendiri. Berbeda dengan blok silinder yang cekungannya terpisah, versi ini memungkinkan anak lebih cepat mencoba dan mengulang.",
    ["2-3y", "3-4y", "4-5y"], "tinggi", True,
    ["Gagangan silinder harus kuat dan tersambung rapat, tidak ada part yang mudah patah. Gunakan di meja atau lantai dan simpan setelah bermain agar anak yang lebih kecil tidak menemukan silindernya di lantai."],
    [R_AMI],
    "Cari versi individu satu bingkai bila ingin mencoba dulu; untuk versi lengkap biasanya satu gambaran besar di toko Montessori.",
)
add(
    "geometric-insets", "Metal atau kayu inset geometris",
    "Kumpulan bingkai dengan bentuk-bentuk geometris seperti lingkaran, persegi, dan segitiga yang jangkar bentuknya bisa diangkat dan melacak dengan pensil. Anak melukis bentuk di kertas dengan jari lembut, latihan menyiapkan mata dan tangan menulis bentuk segi yang nanti dipakai untuk huruf dan angka.",
    ["3-4y", "4-5y"], "tinggi", True,
    ["Setiap bentuk harus memiliki gagang besar dan tidak bisa tertelan. Gunakan di meja yang datar dan simpan setelah selesai agar bentuk-bentuk tidak tersebar di lantai tertindih kaki."],
    [R_AMI],
    "Versi murah bisa dibuat sendiri dari karton tebal dalam bingkai bentuk sederhana sebelum memutuskan membeli versi kayu lengkap.",
)
add(
    "color-matching-box", "Kotak pencocokan warna (color tablets atau kecil berwarna)",
    "Sepasang atau lebih tabung, keping, atau karton warna yang sama. Anak dipasangkan dengan permainan mencocokkan warna yang tepat, latihan mengamati perbedaan rona yang layak berbanding dengan warna lain, dan melatih konsentrasi membandingkan dua benda yang nyaris serupa.",
    ["2-3y", "3-4y"], "rendah", True,
    ["Bila memakai tabung atau botol kecil, pastikan tutupnya terkunci dan tidak mudah dibuka anak supaya isi tidak tertelan atau tumpah. Gunakan bahan yang tidak mudah pecah dan bersihkan secara rutin."],
    [R_MONTE_NOTEBOOK],
    "Cukup gunakan kertos warna, bobot benang warna, atau kaca mata kecil dengan tutup warna sama dari benda-benda rumah.",
)
add(
    "texture-fabric-basket", "Keranjang kain berbagai tekstur",
    "Keranjang kecil berisi potongan kain yang berbeda rasa permukaannya, seperti halus berbulu, kasar, licin, dan kaku. Balita mengeluar-masukkan kain, mengrubanya, dan membiasakan diri dengan kata-kata lembut, kasar, licin yang kaya mendeskripsikan dunia raba tangannya.",
    ["6-9m", "9-12m", "12-18m"], "rendah", True,
    ["Potong kain dengan ukuran yang tidak mudah terkeret ke mulut bayi (sekitar sekepalan tangan atau lebih besar). Hindari hiasan berumbai panjang, ikatan, dan kertas beruda, dan duduk bersama bayi selama bermain."],
    [R_ZTT_BRAIN],
    "Gunakan potongan kain dari pake rusak bekas yang sudah dicuci bersih dan taruh di keranjang pendek yang mudah dijangkau anak.",
)
add(
    "treasure-basket", "Treasure basket (keranjang harta benda rumah tangga)",
    "Keranjang berisi benda-benda yang aman dari sekitar rumah dengan tekstur, bobot, dan bunyi yang berbeda, seperti sendok kayu, bola kayu besar, kertas foil, dan pens silikon. Bayi yang sudah duduk berlatih mengeksplore dunia nyata dengan perabaan yang penuh perhatian.",
    ["6-9m", "9-12m"], "rendah", True,
    ["Setiap benda harus jauh lebih besar daripada mulut bayi agar tidak bisa tertelan; tabung gulungan kertas toilet adalah garis ukur yang baik. Hindari benda tajam, pecah belah, atau yang memiliki tali, dan tetap duduk di samping bayi selama bermain."],
    [R_NHS_PLAY],
    "Kumpulkan benda dari dapur dan ruang keluarga, tampilkan hanya lima sampai delapan benda sekaligus dan ganti berasal sesekali supaya tetap menarik.",
)
add(
    "spindle-rod-box", "Kotak bilah untuk angka (spindle box sederhana)",
    "Dua wadah berlabel angka 0-9 beserta 45 bilah kayu kecil yang ditanak anak ke wadah sesuai angkanya. Permainan ini membuat anak melihat dengan mata dan tangan bahwa angka 5 berarti pasti lima bilah, pengalaman yang membuat bilangan menjadi nyata bukan begitu saja suara yang dihafal.",
    ["3-4y", "4-5y"], "sedang", True,
    ["Bilah kayu harus halus dan panjangnya cukup besar agar tidak bisa tertelan. Gunakan in meja atau lantai datar dan simpan setelah selesai supaya bilah-bilah tidak berkeliaran di ruang bermain."],
    [R_AMI],
    "Versi sederhana bisa dibuat dari kotak sepatu kecil dan tongkat es krim atau pita label angka yang jelas.",
)
add(
    "number-rods-simple", "Batang angka sederhana (number rods versi rumah)",
    "Batang-batang kayu dengan panjang bertingkat yang dibagi warna setiap satu satuan, sehingga anak bisa membandingkan panjang sekaligus melihat jumlah dari garis warnanya. Menyentuh dan menyusun batang membuat anak menghubungkan panjang dengan bilangan sebelum mengenal angka di kertas.",
    ["3-4y", "4-5y"], "sedang", True,
    ["Batang terpendek harus lebih besar dari tabung gulungan kertas toilet dan permukaannya halus. Gunakan di lantai dan dampingi anak agar batang tidak diayunkan ke arah orang atau benda."],
    [R_ZTT_BRAIN],
    "Bisa dibuat dari stik es krim yang dilem berpuluh atau dari bilah karton berwarna yang disusun berkelompok.",
)
add(
    "threading-beads-large", "Untai manik besar (threading beads)",
    "Manik-manik besar berlubang lebar dengan tali kokoh berujung kaku yang mudah dipegang anak. Menyelipkan tali ke dalam lubang manik adalah latihan mata-tangan cukup banyak yang bisa berhenti dan dilanjutkan sesuai kesabaran anak hari itu.",
    ["2-3y", "3-4y", "4-5y"], "rendah", False,
    ["Manik harus jauh lebih besar dari tabung gulungan kertas toilet agar tidak bisa tertelan. Gunakan tali yang pendek (kira-kira 30 cm atau kurang) sehingga tidak mungkin melilit leher anak, dan duduk bersama anak selama bermain."],
    [R_HCH_TOYS],
    "Cari set 'lacing beads' dengan manik kayu besar dan tali pendek yang ujungnya bukan jarum runcing.",
)
add(
    "lacing-cards", "Kartu menjahit (lacing cards)",
    "Karton tebal yang telah dilubang-lubang di tepi bentuk gambar, dengan tali pendek yang anak masukkan keluar lubang mengelilingi gambar. Gerakan berirama ini menghaluskan kontrol tangan anak dan membiasakan arah tangannya yang nantinya sama dengan mengikuti garis saat belajar menulis.",
    ["3-4y", "4-5y"], "rendah", True,
    ["Tali harus pendek dan berujung tidak runcing. Mainkan di meja dekat orang dewasa dan simpan setelah selesai supaya tali tidak dipakai anak untuk meleaning pelintir benda lain."],
    [R_ZTT_BRAIN],
    "Cukup lubang-lubangi tutup kardus bekas sesuai gambar dan gunakan tali sepatu bersih atau tasi benang yang tebal.",
)
add(
    "transferring-tray", "Tray memindahkan dengan sendok (transferring)",
    "Satu tray dengan dua mangkuk kecil dan satu sendok. Anak memindahkan bahan seperti bola karaton atau kacang-polong besar dari mangkuk satu ke yang lain dengan gerakan sendok yang hati-hati, latihan kecil setiap hari yang menyembunyikan persiapan tangan untuk makan sendiri.",
    ["18-24m", "2-3y", "3-4y"], "rendah", True,
    ["Pilih bahan yang jelas lebih besar dari mulut anak supaya tidak berisiko tertelan. Duduk bersama anak agar bahan tidak dibawa ke mulut, dan hindari biji-bijian kecil atau marmer untuk anak-di-bawah tiga tahun."],
    [R_HCH_CHOKE],
    "Gunakan sendok aman anak dan mangkuk dari rumah; mulai dengan bahan mudah seperti bola kapur atau kerikil besar yang bersih.",
)
add(
    "pouring-tray", "Tray menuang air ke piala kecil (pouring)",
    "Satu tray dengan piala kecil berisi air sedikit dan piala kosong. Anak menuang air dari satu piala ke piala lain pelan-pelan lalu menyerap tetesan dengan lap kecil, latihan fokus dan koordinasi yang menyenangkan serta menanamkan kebiasaan merapikan sendiri hasil kerjanya.",
    ["2-3y", "3-4y"], "rendah", True,
    ["Gunakan piala dari bahan tidak mudah pecah dan isi air sangat sedikit agar kegagalan tetap terkendali. Simpan tray di rak aman setelah selesai dan dampingi anak agar air tidak dicampur dengan peralatan listrik atau dilempar ke lantai."],
    [R_NHS_PLAY],
    "Gunakan piala kopi kecil atau piala plastik keras ukuran kecil dan lap kecil yang khusus untuk bermain menuang.",
)
add(
    "dressing-frame-homemade", "Papan latihan buka-tutup (dressing frame versi rumah)",
    "Papan kayu atau kardus dengan bahan bekas pakaian yang dilampirkan: velcro besar, kancing besar, atau zipper. Anak berlatih membuka dan menutup sendiri, keterampilan yang kelak membuat pagi berpakaian lebih mudah karena tangannya sudah banyak berlatih.",
    ["2-3y", "3-4y", "4-5y"], "rendah", True,
    ["Hindari komponen kecil yang bisa lepas seperti kancing kecil atau zipper dengan ujung runcing. Jangan guna pita panjang yang bisa melilit jari, dan dampingi anak di awal sampai ia merasa yakin."],
    [R_ZTT_BRAIN],
    "Cukup pasang sepotong bekas kemeja atau sepatu velcro pada papan atau karung kecil, lalu sew sisi-sisinya supaya aman.",
)
add(
    "folding-cloths", "Kain lipat dengan garis panduan (folding cloths)",
    "Beberapa kain kecil yang diberi garis panduan agar tahu batas lipatan. Anak melipat serong atau melipat dua dengan dua tangan, gerakan yang menuntut kerapian dan kelembutan, dan juga menanamkan kebiasaan menyelesaikan tugas dari mulai hingga selesai.",
    ["2-3y", "3-4y"], "rendah", True,
    ["Gunakan kain ukuran kecil sekitar dua belas sampai dua puluh sentimeter agar tidak menutupi wajah anak. Simpan kain di keranjang setelah bermain dan dampingi anak di awal latihan."],
    [R_MONTE_NOTEBOOK],
    "Cukup kain dari kaos bekas yang bersih dengan garis ditebarkan atau ditempel pita kasa sebagai petunjuk lipatan.",
)
add(
    "crayon-tray", "Tray krayon pendek dan kertas kecil",
    "Sekelompok krayon pendek dan selembar kertas di atas tray sebagai undangan menggambar bebas. Anak berlatih memegang alat gambar dengan posisi tangan yang sehat dan pelajari bahwa setiap alat punya tempatkannya kembali agar tray siap digunakan lain kali.",
    ["18-24m", "2-3y", "3-4y", "4-5y"], "rendah", False,
    ["Pilih krayon dengan label non-toksik dan tanpa tutup kecil yang bisa tertelan. Anak yang masih kebiasaan menyelipkan benda ke mulut harus tetap didampingi, dan ganti krayon yang patah menjadi bagian kecil sebelum diberikan."],
    [R_HCH_TOYS],
    "Krayon segitiga atau bulat pendek lebih mudah dipegang oleh tangan kecil dan tidak mudah berguling dari meja.",
)

with open("content/parts/materials-1.json", "w", encoding="utf-8") as f:
    json.dump(materials, f, ensure_ascii=True, indent=1)
