'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "7fd2945f959a42914e12f4fe6b9df328",
"version.json": "913deafd0d3544e67487bc96d57dd160",
"index.html": "7c712f6747b13e7d95c6a4f622cc2594",
"/": "7c712f6747b13e7d95c6a4f622cc2594",
"baixar.html": "c0f2b2212e2a64ca0d98b960bcf52508",
"orcamento.html": "fce52e3ee51cc652bb88de9fdc5b70db",
"main.dart.js": "e11242e6f39ba1d78f8611a7d933d823",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"favicon.png": "60e21d697a047a4aa2752c932d4f8af6",
"download/version.json": "cb54a1f93710df3fea38b058e295779d",
"download/index.html": "33606c43c829808e489b7f11fd4794a1",
"download/opspilot.apk": "5f60392aab784dade573099b64ec45c5",
"icons/Icon-192.png": "97609f7d4c4f604d2c76be36db299003",
"icons/Icon-maskable-192.png": "5cdcbd8f91be8c2ca2aaaa71e7581c3d",
"icons/Icon-maskable-512.png": "1f83059e6c4ae895c028388004697e08",
"icons/Icon-512.png": "692f2469d84346205d9d3fe8cad5c8eb",
"acompanhar.html": "fb36d9ec117844ac4bc25d562ea0e9a7",
"manifest.json": "410c4505ead13e147fbf68d86520cab4",
"assets/AssetManifest.json": "f7b90e7184d506d1ee063173fd392643",
"assets/NOTICES": "7997c2c22c74f52c314b32dd878a8f33",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "f30096cb75cbe230c65a0d29880633ee",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/record_web/assets/js/record.fixwebmduration.js": "1f0108ea80c8951ba702ced40cf8cdce",
"assets/packages/record_web/assets/js/record.worklet.js": "6d247986689d283b7e45ccdf7214c2ff",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "acdcba830e47622fda902f8b55169252",
"assets/fonts/MaterialIcons-Regular.otf": "53312fded5e34ce8ae1ecf1f81c55c72",
"assets/assets/images/logo_soluclean_verde.png": "f631b79eb3d34d3a631c06414d2559ff",
"assets/assets/images/logo_splash.png": "d0cfa828e463d593b115557a7bb3dda8",
"assets/assets/images/manuals/A5/page_91.jpg": "0ee7bf6c2aee21898dab209284e07631",
"assets/assets/images/manuals/A5/page_85.jpg": "76ea007bb6a636284cb242c3819acc34",
"assets/assets/images/manuals/A5/page_52.jpg": "36f0e9e8b33ccf9810420f5a6628e26e",
"assets/assets/images/manuals/A5/page_46.jpg": "3e7365144d4e42d025eec506ffad408e",
"assets/assets/images/manuals/A5/page_2.jpg": "d267f0f6e2c34ef28553c3630f1f479f",
"assets/assets/images/manuals/A5/page_3.jpg": "41c3f866b1c6a5f3abb565c12c5bab40",
"assets/assets/images/manuals/A5/page_47.jpg": "da2b012e4736d02684d9d59f6efa8658",
"assets/assets/images/manuals/A5/page_53.jpg": "b6370343ffa1b1e1facfe6f01de8d8dd",
"assets/assets/images/manuals/A5/page_84.jpg": "f2b2bd74dcc92769c6152dffae396e46",
"assets/assets/images/manuals/A5/page_90.jpg": "2283edbde99869f07930961fec6f8fe2",
"assets/assets/images/manuals/A5/page_86.jpg": "13cc29c5004242b1b5b7ad129cf61905",
"assets/assets/images/manuals/A5/page_92.jpg": "2a01277dce263550a28e0e15c14f9bbf",
"assets/assets/images/manuals/A5/page_79.jpg": "db7bdaca92f07bae68fc192e85427dbe",
"assets/assets/images/manuals/A5/page_45.jpg": "31367af78d727e5bc90d33f95abd3561",
"assets/assets/images/manuals/A5/page_51.jpg": "bbda1597a54c36a78eda94ab1c9313aa",
"assets/assets/images/manuals/A5/page_1.jpg": "9456b9b5f6ed4fd5216d61ca6506fb4e",
"assets/assets/images/manuals/A5/page_50.jpg": "a7822920d25940b076ae16623e64c17f",
"assets/assets/images/manuals/A5/page_44.jpg": "b361a44bef6b0d82b280f841e1694b52",
"assets/assets/images/manuals/A5/page_78.jpg": "e5b3cb383e74637d604d1278d4fbad4c",
"assets/assets/images/manuals/A5/page_93.jpg": "08d9fd87ad54ca596493173e184c2fcd",
"assets/assets/images/manuals/A5/page_87.jpg": "479e774b15d37fa7e367ea3535b0e47b",
"assets/assets/images/manuals/A5/page_83.jpg": "3090d17047228f1cc2d4506c1766f129",
"assets/assets/images/manuals/A5/page_97.jpg": "f79b594788b6137a0a290fb2357f1042",
"assets/assets/images/manuals/A5/page_40.jpg": "22c9578104d1d0347f29ff723bd54a18",
"assets/assets/images/manuals/A5/page_54.jpg": "5d9176735a0f63fa4976d92a68298fe9",
"assets/assets/images/manuals/A5/page_68.jpg": "fe037e9cc3b6a1257f1e4a4e364ea7cd",
"assets/assets/images/manuals/A5/page_4.jpg": "a7aca2538a903ab827a6686bf083a3b7",
"assets/assets/images/manuals/A5/page_5.jpg": "9600755d8d379b9c974c83d08d02c320",
"assets/assets/images/manuals/A5/page_69.jpg": "33eea831d8013597c2ac3e6b6bc674b6",
"assets/assets/images/manuals/A5/page_55.jpg": "28eea3e9567ed42bbd9bcf1cc83553f5",
"assets/assets/images/manuals/A5/page_41.jpg": "7f3f19c944017b482b40af04c45471a6",
"assets/assets/images/manuals/A5/page_96.jpg": "790fab6fdd9235fb480860ff473b83c9",
"assets/assets/images/manuals/A5/page_82.jpg": "2cab13ba2670f4d04dc5013c1bc67d9d",
"assets/assets/images/manuals/A5/page_94.jpg": "610203659e78e4ed7651c8833ae99f48",
"assets/assets/images/manuals/A5/page_80.jpg": "c3d448f5dcf55ccbd48de6667d74a21d",
"assets/assets/images/manuals/A5/page_57.jpg": "02c9053a50b7af07f736184797de5633",
"assets/assets/images/manuals/A5/page_43.jpg": "220a384b6a510ac53c69b02e0183b1da",
"assets/assets/images/manuals/A5/page_7.jpg": "7eb0330bfc0ef23d66f8e5e268a99909",
"assets/assets/images/manuals/A5/page_6.jpg": "054f868c3594c237b000a3d27d6f5606",
"assets/assets/images/manuals/A5/page_42.jpg": "b4a11304619cff5c3823d4a72e7cf708",
"assets/assets/images/manuals/A5/page_56.jpg": "40b91938f769d10fd33dd1a2229d79d2",
"assets/assets/images/manuals/A5/page_81.jpg": "872392f2d6e52cbcc689ae40f423d90c",
"assets/assets/images/manuals/A5/page_95.jpg": "a7163a1eba964f6cbc48b79d51bee20e",
"assets/assets/images/manuals/A5/page_19.jpg": "1306e3ac9431a5669744d7b7e70ea1a6",
"assets/assets/images/manuals/A5/page_31.jpg": "f6dfb4c4908be671926ec1b20fe258e5",
"assets/assets/images/manuals/A5/page_25.jpg": "915dd1d327c701d1094385ce7e4cee68",
"assets/assets/images/manuals/A5/page_24.jpg": "8eb621dfebe471be74f71bf87273cd69",
"assets/assets/images/manuals/A5/page_30.jpg": "3ca3ede86fe78579998d2ef6fa0ffec9",
"assets/assets/images/manuals/A5/page_18.jpg": "ac49520ddfc75d54d96f278f2cd8238c",
"assets/assets/images/manuals/A5/page_26.jpg": "1b6a8d446e6337289a15c14dea73a53d",
"assets/assets/images/manuals/A5/page_32.jpg": "cb99f0d4371f199bdb2e9d4db0ba5e03",
"assets/assets/images/manuals/A5/page_33.jpg": "26a3bbb9c3fd5f7a068c4b2e0c447c25",
"assets/assets/images/manuals/A5/page_27.jpg": "a54f3d81610d21951e6f4ee69ad5efa3",
"assets/assets/images/manuals/A5/page_23.jpg": "273e128d2aca20ae100418c8823c532c",
"assets/assets/images/manuals/A5/page_37.jpg": "3d440ac73e48db667d8b38f700e6aa5a",
"assets/assets/images/manuals/A5/page_108.jpg": "bf9f2a8070a2e6b3ea49f99219208783",
"assets/assets/images/manuals/A5/page_109.jpg": "1ac004ef2a2fdd1721bd87b564a3ffcc",
"assets/assets/images/manuals/A5/page_36.jpg": "7ada96367e414f0daf3354a993bc393b",
"assets/assets/images/manuals/A5/page_22.jpg": "873a8afc164151df64702ddeb8bb653c",
"assets/assets/images/manuals/A5/page_34.jpg": "17426c6293e6dfbc33563f19fe6e6041",
"assets/assets/images/manuals/A5/page_20.jpg": "bfffe0c12345997e9df2304d87cdc4f9",
"assets/assets/images/manuals/A5/page_21.jpg": "368bb87ee9ae4979a37f40752bd032b5",
"assets/assets/images/manuals/A5/page_35.jpg": "3af263092a3da275722beedbbe6b9a91",
"assets/assets/images/manuals/A5/page_38.jpg": "f5cad8b2cea5d5fc07b54733a2e4a487",
"assets/assets/images/manuals/A5/page_10.jpg": "0a6d356130ba90d776ba6ded14643d93",
"assets/assets/images/manuals/A5/page_113.jpg": "fc1d968774b8a0523b99f4aec3c5fa3a",
"assets/assets/images/manuals/A5/page_107.jpg": "02e252c3f177bb7d7bf8ee077d41f476",
"assets/assets/images/manuals/A5/page_106.jpg": "6f1b20431def4be53e242bd48d4539b1",
"assets/assets/images/manuals/A5/page_112.jpg": "5c8e1d9b050a7845aaa0b543a1a550b3",
"assets/assets/images/manuals/A5/page_11.jpg": "64545d1cf1a26b5aead02cdf63fe4b6e",
"assets/assets/images/manuals/A5/page_39.jpg": "f4a46f17ebc8e709b71686502ee4b67e",
"assets/assets/images/manuals/A5/page_13.jpg": "4454e4260ef29da23d77d311724bd416",
"assets/assets/images/manuals/A5/page_104.jpg": "db3cd5d3ebd05ce2ab80d7db89ba8384",
"assets/assets/images/manuals/A5/page_110.jpg": "ba15774cabf3b195775f46b9ae044166",
"assets/assets/images/manuals/A5/page_111.jpg": "d3503f2151c3a764cf14bcb167daf562",
"assets/assets/images/manuals/A5/page_105.jpg": "cd27ef75870df188030d4c4aba858a0f",
"assets/assets/images/manuals/A5/page_12.jpg": "ed5385c0c61af4d2b1ee540bd5c202f7",
"assets/assets/images/manuals/A5/page_16.jpg": "4aa3b90b040f69a253575066b9329bb3",
"assets/assets/images/manuals/A5/page_101.jpg": "850b4fb2334c8a22c56a1a81d3636cf5",
"assets/assets/images/manuals/A5/page_100.jpg": "b86819cdf418e1d0d763ff9c27849198",
"assets/assets/images/manuals/A5/page_17.jpg": "07cafc4e0a0fc073f9759363782b2a45",
"assets/assets/images/manuals/A5/page_15.jpg": "fa7d6a45469a86ee39b9425c40725656",
"assets/assets/images/manuals/A5/page_29.jpg": "a81fed12f49a4d7e296c501db619ee60",
"assets/assets/images/manuals/A5/page_102.jpg": "ac8bf450be0b3e90fd2100ca34a0fb0a",
"assets/assets/images/manuals/A5/page_103.jpg": "46c0b0dc1ebc1366ac267386e09f90a4",
"assets/assets/images/manuals/A5/page_28.jpg": "b91d815a4b013ce80c810d4e2c057081",
"assets/assets/images/manuals/A5/page_14.jpg": "5264703279c10bb20acdbc7687c186f5",
"assets/assets/images/manuals/A5/page_98.jpg": "1f980a159a01457d1b3000303802da4a",
"assets/assets/images/manuals/A5/page_73.jpg": "ab49cf7bd33d9be49c5852d991082998",
"assets/assets/images/manuals/A5/page_67.jpg": "8c58e50b875217e9c30e4a12493760b6",
"assets/assets/images/manuals/A5/page_66.jpg": "f64ba5351bffe0ee8065ee2d2ae0cc16",
"assets/assets/images/manuals/A5/page_72.jpg": "5d8869a2d1ecb7e5134ea5afb0b358bd",
"assets/assets/images/manuals/A5/page_99.jpg": "c5173a12a358f917dde03eca6cc1cceb",
"assets/assets/images/manuals/A5/page_58.jpg": "65367483b164b25c7fa83859431fbce8",
"assets/assets/images/manuals/A5/page_64.jpg": "08ba577cc662fe7e19fc853840fd6bc9",
"assets/assets/images/manuals/A5/page_70.jpg": "95ec1a9c8a525e4cced60e5c26f4b3c1",
"assets/assets/images/manuals/A5/page_8.jpg": "5904bcf31861141f4ee3526de93fe0e8",
"assets/assets/images/manuals/A5/page_9.jpg": "ba7161db143265d3c5a4f8054c0c951e",
"assets/assets/images/manuals/A5/page_71.jpg": "2302de4dbcd966dba2334175565c849a",
"assets/assets/images/manuals/A5/page_65.jpg": "53028a94306c9d84c67d9b1720914fe7",
"assets/assets/images/manuals/A5/page_59.jpg": "4969cd7c0743075f99ba280aac8c41f3",
"assets/assets/images/manuals/A5/page_61.jpg": "263c218376d326e61145231f09d418f0",
"assets/assets/images/manuals/A5/page_75.jpg": "b0da9c57c99f6813c7b9c2b23d61ef03",
"assets/assets/images/manuals/A5/page_49.jpg": "cdfa9fa7cf6918564dbe3a2dd9646c36",
"assets/assets/images/manuals/A5/page_48.jpg": "88e4d7fb05ae3854abed63902809e783",
"assets/assets/images/manuals/A5/page_74.jpg": "d8ceab2d7805a7d611165d0de366c78d",
"assets/assets/images/manuals/A5/page_60.jpg": "81b62434305bd3e8d5705aad945c5cb3",
"assets/assets/images/manuals/A5/page_89.jpg": "e61579a219130040404d42f26a9c6a92",
"assets/assets/images/manuals/A5/page_76.jpg": "28b7c4a5397403b2a346bca07eddbb6e",
"assets/assets/images/manuals/A5/page_62.jpg": "60eaa2fa53eb78edc84bd8473a4c77aa",
"assets/assets/images/manuals/A5/page_63.jpg": "33f30510eb5d6e77af4288098dfb5135",
"assets/assets/images/manuals/A5/page_77.jpg": "92aedf6430bfeca808af23f1d831a6bf",
"assets/assets/images/manuals/A5/page_88.jpg": "af7f1b2fa6161a8078b44016e9ec7f8b",
"assets/assets/images/manuals/B70/page_2.jpg": "d8e439518775afff4409a243db937bd2",
"assets/assets/images/manuals/B70/page_3.jpg": "742cd57a5f4b343e67ac48df1ff09416",
"assets/assets/images/manuals/B70/page_1.jpg": "e756b34fd70e9bc8dc9bea8b64970a6a",
"assets/assets/images/manuals/B70/page_4.jpg": "513b5b808460a01263aa8f7b2b0605cf",
"assets/assets/images/manuals/B70/page_5.jpg": "a75b45e012817bd2e9201e36ff2daa70",
"assets/assets/images/manuals/B70/page_7.jpg": "41692b9755715ec6f6f2a76e0e64e4d8",
"assets/assets/images/manuals/B70/page_6.jpg": "d24269d48b0519712011e0c60996c3a1",
"assets/assets/images/manuals/B70/page_19.jpg": "82ca120e799ce127d7051b9f099e4cd0",
"assets/assets/images/manuals/B70/page_31.jpg": "bb785cad644a55e2145b91379c3c0352",
"assets/assets/images/manuals/B70/page_25.jpg": "1fed68ccbd3a50b55dfb5bfca0397c52",
"assets/assets/images/manuals/B70/page_24.jpg": "f3fc309f71bdcd25b4a7a0d7caa1d149",
"assets/assets/images/manuals/B70/page_30.jpg": "5294ed9f6b22976ebb1229821a2642b8",
"assets/assets/images/manuals/B70/page_18.jpg": "f24b1b9dabeaca89fe644bab2a7c091d",
"assets/assets/images/manuals/B70/page_26.jpg": "f94a1c7f87403d1da78acd13a69c3f9f",
"assets/assets/images/manuals/B70/page_32.jpg": "4e58a238ceefa1fbaca2d018de313c4b",
"assets/assets/images/manuals/B70/page_33.jpg": "d8e439518775afff4409a243db937bd2",
"assets/assets/images/manuals/B70/page_27.jpg": "efe5665b89d804dd3481daee42e7bfd8",
"assets/assets/images/manuals/B70/page_23.jpg": "935aea3a6995626ec8a5b6923f76e007",
"assets/assets/images/manuals/B70/page_22.jpg": "2927cd57bb4e61198e7e1ade3faf1b1f",
"assets/assets/images/manuals/B70/page_34.jpg": "3feaffd4982e23326c73989e7ff7ddfc",
"assets/assets/images/manuals/B70/page_20.jpg": "3cf67a5317d4e9c7beb1e3e7587ae8cb",
"assets/assets/images/manuals/B70/page_21.jpg": "5c840b7be6b414b375293476c6264b1d",
"assets/assets/images/manuals/B70/page_10.jpg": "d2345043465704f493c269eb97dc8860",
"assets/assets/images/manuals/B70/page_11.jpg": "71b2277bfad45249d6a44ecf679d01a1",
"assets/assets/images/manuals/B70/page_13.jpg": "2d776cb6950608b4ef9a947fde0af556",
"assets/assets/images/manuals/B70/page_12.jpg": "bdcfa0580cfd0cb89585cd6a2f11ce13",
"assets/assets/images/manuals/B70/page_16.jpg": "b484a4d714264720bfba17fbfa6f2b24",
"assets/assets/images/manuals/B70/page_17.jpg": "049e3f87764c2588417bccc22026cd3e",
"assets/assets/images/manuals/B70/page_15.jpg": "c7908c1c410e92ef29e90b3ff7dd166b",
"assets/assets/images/manuals/B70/page_29.jpg": "5b62efd0f36e2d32a5276d93cd9ff56e",
"assets/assets/images/manuals/B70/page_28.jpg": "ff5433a9d14b33174c7c10626d9c1ff8",
"assets/assets/images/manuals/B70/page_14.jpg": "80b31d9a93972b9f5fc104c03c2f4ce8",
"assets/assets/images/manuals/B70/page_8.jpg": "f2f4ef312e3a0b2582a83abe34f7c127",
"assets/assets/images/manuals/B70/page_9.jpg": "59cd4c635d9a7c5e36b13c96963cd9a4",
"assets/assets/images/manuals/Brava/page_2.jpg": "619308efc5a6addfe50d913888f3b29f",
"assets/assets/images/manuals/Brava/page_3.jpg": "2c3f47f504ce26a509bdff90b44c2bbd",
"assets/assets/images/manuals/Brava/page_1.jpg": "2836414c880a59db2bfd3ac5579fa156",
"assets/assets/images/manuals/Brava/page_40.jpg": "e3ddd67ccf5f74877a6e7fff3a011983",
"assets/assets/images/manuals/Brava/page_4.jpg": "07cbbddf7691ab088be34e58a3fc752b",
"assets/assets/images/manuals/Brava/page_5.jpg": "6fca6b38101f385f9f8ff9616223965f",
"assets/assets/images/manuals/Brava/page_7.jpg": "b6d38563281a53e705dff83cd8de4b57",
"assets/assets/images/manuals/Brava/page_6.jpg": "099de7cb27e79be9f3cc977560f0d901",
"assets/assets/images/manuals/Brava/page_19.jpg": "6b7824ef1070adaea629972e4eb41251",
"assets/assets/images/manuals/Brava/page_31.jpg": "7c2f3f42a86d54f11dd7d4b31c190214",
"assets/assets/images/manuals/Brava/page_25.jpg": "089ee2cfd3324f6cd47a68e63c176a72",
"assets/assets/images/manuals/Brava/page_24.jpg": "851c764ae0a6357ca4b1d1aea153d09b",
"assets/assets/images/manuals/Brava/page_30.jpg": "470988787fb05c42455c8d65d02ba1ac",
"assets/assets/images/manuals/Brava/page_18.jpg": "1d2900457be507bcd0ce4b61dac583c2",
"assets/assets/images/manuals/Brava/page_26.jpg": "740cb40067dbef981cb88c2f8cba2a14",
"assets/assets/images/manuals/Brava/page_32.jpg": "c651b1baf8bb4324f465dd78fa17ddae",
"assets/assets/images/manuals/Brava/page_33.jpg": "521dbe6fea4a9492eb37510ab39e70fb",
"assets/assets/images/manuals/Brava/page_27.jpg": "99d6549ca7e354566d9e27b283f94cc9",
"assets/assets/images/manuals/Brava/page_23.jpg": "329a5c4b33a40fa7a1d1a491739e9d64",
"assets/assets/images/manuals/Brava/page_37.jpg": "e16c54f6cf04fec6b5cd1197d0d403c8",
"assets/assets/images/manuals/Brava/page_36.jpg": "ce291287143ef9d0813639823d6a9188",
"assets/assets/images/manuals/Brava/page_22.jpg": "09d5707926000f75eaac44a1ae7fb43c",
"assets/assets/images/manuals/Brava/page_34.jpg": "5fc82a10eb980f99aa937606ab010792",
"assets/assets/images/manuals/Brava/page_20.jpg": "0094a49ffd761161c87745f1e0ad8971",
"assets/assets/images/manuals/Brava/page_21.jpg": "cc00100d56a196b8dc7ecca298eb4a89",
"assets/assets/images/manuals/Brava/page_35.jpg": "8608842488474e755d4c9fe894854c4c",
"assets/assets/images/manuals/Brava/page_38.jpg": "7aad6ca5220ff4acd0f0e90544115fcf",
"assets/assets/images/manuals/Brava/page_10.jpg": "6030711d66e01cbeb169c9d1b2cb44f2",
"assets/assets/images/manuals/Brava/page_11.jpg": "e87f88df25ec1376661a4112d4f68504",
"assets/assets/images/manuals/Brava/page_39.jpg": "084d0abc4945feb4716c0997811d262e",
"assets/assets/images/manuals/Brava/page_13.jpg": "112e2aef829f5569c2cbf6140f83b7a4",
"assets/assets/images/manuals/Brava/page_12.jpg": "84b920620594cd84f958042863a364d8",
"assets/assets/images/manuals/Brava/page_16.jpg": "73ecdffa754afc0795bd15af39a614be",
"assets/assets/images/manuals/Brava/page_17.jpg": "dd879267fb31be967c3990145e624267",
"assets/assets/images/manuals/Brava/page_15.jpg": "ce68d9938a2905087a286d44d9888d50",
"assets/assets/images/manuals/Brava/page_29.jpg": "1a3a6f3115ac175215c258334b828656",
"assets/assets/images/manuals/Brava/page_28.jpg": "b7fb9f8eecda5bcb0f9e2848b3d7ecd8",
"assets/assets/images/manuals/Brava/page_14.jpg": "8b54c5bef9e8346e7821f7ea538cac5d",
"assets/assets/images/manuals/Brava/page_8.jpg": "3cb91781cd8eab87aaf261a421ba6358",
"assets/assets/images/manuals/Brava/page_9.jpg": "916082893034a67e03c6720befaeb0fa",
"assets/assets/images/logo_soluclean.jpg": "91906581525fdfcfcadafa5f68ddbf9f",
"assets/assets/manual_catalog.json": "2ac80923e96944419d09f81264ad58ea",
"assets/assets/manual_pages_data.json": "083c28c69ea7c865dd340cd301ccd7f0",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.js": "34beda9f39eb7d992d46125ca868dc61",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/canvaskit.js": "86e461cf471c1640fd2b461ece4589df",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
