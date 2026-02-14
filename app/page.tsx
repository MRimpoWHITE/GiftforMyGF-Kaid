"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Type Definitions ---
type Choice = {
  text: string;
  nextScene: string;
  isRunaway?: boolean;
  response?: string; // ✅ เพิ่ม: ข้อความที่จะขึ้นหลังจากกดเลือก
};

type IntroStep = {
  text: string;
  image?: string;
  speaker?: string;
  memoryImage?: string;
};

type MemoryItem = {
  id: string;
  x: number;
  y: number;
  icon: string;
  memoryImage: string;
  characterImage?: string;
  introSteps: IntroStep[];
  text: string;
  choices: Choice[];
};

type Scene = {
  introSteps: IntroStep[];
  text: string;
  character: string;
  speaker?: string;
  choices: Choice[];
  isGallery?: boolean;
  galleryItems?: MemoryItem[];
};

// --- Story Configuration ---
const story: Record<string, Scene> = {
  // ... (ฉาก start - mood_soso เหมือนเดิม) ...
  start: {
    speaker: "Kait (เกด)",
    introSteps: [
      { text: "......", image: "", speaker: "Kait (เกด)" },
      { text: "ครอกฟี้... Zzz...", image: "/Phu+Sleeping.png", speaker: "Phu (ภู)" },
    ],
    text: "(ภูกำลังหลับ... เอาไงดี?)",
    character: "/Phu+Sleeping.png",
    choices: [
      { text: "จิ้มๆ ปลุก 👉", nextScene: "wake_poke" },
      { text: "ตบหน้าปลุก 👋", nextScene: "wake_slap" },
    ],
  },
  wake_slap: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "โอ้ยๆ! ใครน่ะ... ที่รักเค้าเองงง มาแล้วหยอ?", image: "/Phu+Hurt.png", speaker: "Phu (ภู)" },
    ],
    text: "ว่าแต่ทำไมต้องทำร้ายกันด้วย แง 😭",
    character: "/Phu+angry.png",
    choices: [
      { text: "ที่นี่ที่ไหนเนี่ยย...", nextScene: "location_reveal" },
    ],
  },
  wake_poke: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "(ห้าววว)", image: "/Phu+wakeup.png", speaker: "Phu (ภู)" },
    ],
    text: "ฮาโหลที่รักมาแย้ว เย่! ไงงงง คิดถึงเทอจัง 🥰",
    character: "/Phu+Hi.png",
    choices: [
      { text: "คิดถึงเหมือนกัน", nextScene: "location_reveal" },
      { text: "จ้า", nextScene: "location_reveal" },
    ],
  },
  location_reveal: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "อย่าบอกนะว่าเอาเค้ากลับมาที่เกทลิน?", image: "Phu+idle.png", speaker: "Kait (เกด)" },
      { text: "ช่ายยย ที่นี่มีความทรงจำเยอะ แล้วก็เป็นที่ที่เค้าเจอเทอด้วยไง... ", image: "/Phu+speak.png", speaker: "Phu (ภู)" },
      { text: "หวังว่าจะไม่เป็นอะไรนะ?", image: "/Phu_figout.png", speaker: "Phu (ภู)" },
    ],
    text: "....",
    character: "Phu+idle.png",
    choices: [
      { text: "จ๊ะ ", nextScene: "reply_jah" },
      { text: "เป็นสิ!", nextScene: "reply_pen_si" },
    ],
  },
  reply_pen_si: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "แล้วจะกลับบ้านไงเนี่ย!", image: "Phu+idle.png", speaker: "Kait (เกด)" },
    ],
    text: "หน่าๆ เรื่องนั้นค่อยคิดแล้วกันน่าา... อยู่ด้วยกันก่อน",
    character: "/Phu+Thumpup.png",
    choices: [{ text: "เฮ้อ... ก็ได้", nextScene: "check_day" }],
  },
  reply_jah: {
    speaker: "Phu (ภู)",
    introSteps: [],
    text: "เทอไม่ต้อง งง นะ เค้าก็ งง ",
    character: "/Phu+idk.png",
    choices: [{ text: "อะไรของมันวะ", nextScene: "check_day" }],
  },
  check_day: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "แล้วววว..... ", image: "/Phu+ask.png", speaker: "Phu (ภู)" },
    ],
    text: "วันนี้เป็นไงบ้างงงับ?",
    character: "Phu+Hi.png",
    choices: [
      { text: "ก็ดี", nextScene: "mood_good" },
      { text: "เฉยๆ อะ", nextScene: "mood_soso" },
    ],
  },
  mood_good: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "เฮ้ (แตะไหล) หวังว่ามันจะไม่แย่นะ เค้าอยู่ตรงนี้นะครับ...", image: "/Phu+cheerup.png" },
      { text: "ว่าแต่.....", image: "" },
    ],
    text: "อยากดูอะไรหน่อยไหมม เผื่อจะได้หายกังวลเรื่องแย่ๆ ไปก่อน",
    character: "/Phu_idle2.png",
    choices: [{ text: "ดูสิ มีไรหรอ", nextScene: "memory_gallery" }],
  },
  mood_soso: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "งะ หวังว่าจะยิ้มได้นะ คนสวยของเค้า...", image: "Phu+smile.png" },
    ],
    text: " นี่ๆ เค้ามีไรอยากให้ดู เป็นความทรงจำเล็กๆ ของเรา",
    character: "/Phu_idle2.png",
    choices: [{ text: "ไหนๆ ขอดูหน่อย", nextScene: "memory_gallery" }],
  },


  // --- 6. Gallery Mode ---
  memory_gallery: {
    isGallery: true,
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "ลองจิ้มของรอบๆ ห้องดูสิ... จำได้มั้ยเอ่ย?" },
    ],
    text: "เป็นไงได้ลองกดอะไรบ้างหรือยัง",
    character: "",
    galleryItems: [
      {
        id: "item1",
        x: 25, y: 40,
        icon: "🪞",
        memoryImage: "/item/item1.png",
        characterImage: "/Phu_idle2.png",
        introSteps: [
          { text: "จำได้ป่าว ตอนที่เค้าเคยบอกว่าชอบยืนอยู่หน้ากระจก...", image: "/Phu_idle2.png" },
          { text: "ที่เค้าชอบมากๆก็เพราะมันได้เห็นภาพเราสองคนในนั้น...", image: "" },
          { text: "เทอทำให้เค้า คนที่ไม่ชอบถ่ายรูป กลายเป็นคนที่เก็บรูปเราเต็มเครื่องเลย...", image: "" },
          { text: "รักเทอนะ เกด..", image: "" },
        ],
        text: ".....",
        choices: [
          { text: "จ้า รับทราบ", nextScene: "" },
          { text: "รักเหมือนกัน", nextScene: "" },
        ]
      },
      {
        id: "item2",
        x: 70, y: 30,
        icon: "🧸",
        memoryImage: "/item/item2.png",
        characterImage: "/Phu_idle2.png",
        introSteps: [
          { text: "โอ้ววว รูปนี้...", image: "/Phu_idle2.png" },
          { text: "ตุ๊กตาที่เทอให้ไว้ก่อนเราจากกัน กับป้ายชื่อที่เราแลกกัน", image: "" },
          { text: "เค้าชอบเอาดูบ่อยๆ มันช่วยให้หายคิดถึงได้บ้าง แต่ก็ไม่เท่าเจอเทอ", image: "" },
          { text: "เค้าเก็บมันไว้อย่างดีเลยนะ...", image: "" }
        ],
        text: "หวังว่าเทอก็ทำเหมือนกันนะ",
        choices: [{ text: "จ้า", nextScene: "" }]
      },
      {
        id: "item3",
        x: 73, y: 50,
        icon: "👥",
        memoryImage: "/item/item3.png",
        characterImage: "/Phu_idle2.png",
        introSteps: [
          { text: "อ้าา... ถ้าพูดถึงเกทลิน ไม่พูดถึงแก็งค์เราไม่ได้", image: "Phu+idle.png" },
          { text: "ถึงจะมีทะเลาะกันบ้าง แต่ก็คิดถึงทุกคนแหะ... ", image: "Phu_idle3.png" },
          { text: "เป็นครั้งแรกที่ได้เจอเทอด้วย.... ", image: "" }
        ],
        text: "ทุกคนจะคิดถึงเค้าบ้างไหมนะ... ",
        choices: [{ text: "(ไปต่อ)", nextScene: "" }]
      },
      // ✅✅✅ Item 4 ที่คุณต้องการ (ใส่ response ใน choices) ✅✅✅
      {
        id: "item4",
        x: 53, y: 23,
        icon: "🫙",
        memoryImage: "/item/item4.png",
        characterImage: "",
        introSteps: [
          { text: "ขวดโหลแห่งความตั้งใจ ความรักและความหวัง...", image: "Phu+speak.png" },
          { text: "ชื่อแปลกๆ แต่ก็เอาเหอะ", image: "Phu+think.png" },
          { text: "เค้าตั้งใจทำให้มากเลยนะ มันอาจจะดูไม่ค่อยดีมาก เพราะมันเป็นครั้งแรกที่เคยทำไรแบบนี้", image: "Phu_idle2.png" },
        ],
        text: "หวังว่าเทอจะชอบมันนะงับ",
        choices: [
          {
            text: "จ้า",
            response: "จริงๆมันมีข้อความลับๆอยู่นะ แต่อย่าไปแกะหามันนะ เดียวถึงเวลาเค้าจะบอกเอง", // 👈 ใส่ข้อความตอบกลับ
            nextScene: ""
          },
          {
            text: "ชอบสิ...",
            response: "🫶 จริงๆมันมีข้อความลับๆอยู่นะ แต่อย่าไปแกะหามันนะ เดียวถึงเวลาเค้าจะบอกเอง", // 👈 ใส่ข้อความตอบกลับ
            nextScene: ""
          }
        ]
      },
      {
        id: "item5",
        x: 30, y: 20,
        icon: "✈️",
        memoryImage: "/item/item6.1.png", // รูปหลัก (เผื่อประโยคไหนไม่มีรูป)
        introSteps: [
          {
            text: "ตั๋วเครื่องบินครั้งแรกที่ไปหา นานแล้วเมื่อกันแหะ",
            image: "Phu+think.png",
            memoryImage: "/item/item5.1.png" // 👈 รูปที่ 1
          },
          {
            text: "ตอนนั้นเทอทำหน้าเหวอมากตอนเจอกันครั้งแรก ",
            image: "Phu+wakeup.png",
            memoryImage: "/item/item5.22.png" // 👈 รูปที่ 2 (เปลี่ยนแล้ว!)
          },
          {
            text: "เดทแรกในไทย... ",
            image: "",
            memoryImage: "/item/item5.2.png" // 👈 รูปที่ 3
          },
          {
            text: "แฮงเอ้าแรกในไทยด้วยกัน... ไยบะสนุกกก ",
            image: "Phu+ask.png",
            memoryImage: "/item/item5.3.png" // 👈 รูปที่ 3
          },
          {
            text: "แต่ตอนนั้นทำเทอโกรธครั้งแรกทีไทยด้วย555 ยังรู้สึกผิดอยู่เลย.... ",
            image: "Phu_figout.png",
            memoryImage: "/item/item5.3.png" // 👈 รูปที่ 3
          },
          {
            text: "ไว้ให้เค้าแก้ตัวนะะะ... ",
            image: "Phu+smile.png",
            memoryImage: "/item/item5.3.png" // 👈 รูปที่ 3
          },
          {
            text: "ช่วงเวลาที่ได้อยู่กับเทอ คือช่วงเวลาที่ดีทีสุดเลยนะ... ",
            image: "",
            memoryImage: "/item/item5.4.png" // 👈 รูปที่ 3
          },
          {
            text: "การที่เราอยู่ไกลกัน มันทำให้เค้าทั้งชอบและไม่ชอบสถานที่นี้เลย... ",
            image: "Phu+angry.png",
            memoryImage: "/item/item5.5.png" // 👈 รูปที่ 3
          }
        ],
        text: "ไว้มาสร้างช่วงเวลาดีๆด้วยกันอีกนะที่รัก",
        choices: [
          { text: "จ้าา", nextScene: "" },
          { text: "ไม่เอาเบื่อหน้าเทอละ", nextScene: "dog_scene" },
        ]
      },
    ],
    choices: [
      { text: "ดูครบแล้ว (จบเกม)", nextScene: "ending" },
    ],
  },

  // ✅✅✅ เพิ่มฉาก: ภูกลายเป็นหมา ✅✅✅
  dog_scene: {
    speaker: "Phu (ภู)",
    introSteps: [
      { text: "ม่ายยยยยยยยย!!! 😱", image: "Phu+Sleeping.png" },
      { text: "ปุ้ง!!! (กลายเป็นหมา)", image: "/dog.png" }, // 👈 อย่าลืมหารูปหมามาใส่ ชื่อ dog.png นะครับ
      { text: "โฮ่ง! บรู๊วววววว! 🐶 (แปล: อย่าเบื่อเค้าเลยนะ)", image: "/dog.png" },
      { text: "ปิ๊ง! (กลับร่างเดิม)", image: "/Phu+cheerup.png" }
    ],
    text: "ล้อเล่นน่าาา... ห้ามเบื่อเค้านะ! ",
    character: "Phu+Thumpup.png",
    choices: [
      { text: "อะไรอของมึงเนี่ยภู", nextScene: "memory_gallery" }
    ]
  },

  // --- ฉากจบ (Ending) ---
  ending: {
    speaker: "",
    introSteps: [
      { text: "ขอบคุณนะที่เข้ามาเป็นส่วนสำคัญในชีวิตเค้า", image: "" },
      { text: "ทุกความทรงจำที่มีเทอ มันมีค่ามากจริงๆ", image: "" },
      { text: "Happy Valentine's Day นะครับ", image: "" },
      { text: "รักเทอนะ... เกด ❤️  ", image: "" },
      { text: "รักเทอทุกวันเลยนะ...", image: "" },

    ],
    text: "เจอกัล วันที่ 12 มีนา นะ ✈️🩷",
    character: "",
    choices: []
  }
};

export default function ValentineVN() {
  const [currentSceneKey, setCurrentSceneKey] = useState("start");
  const [history, setHistory] = useState<string[]>([]);

  const [introIndex, setIntroIndex] = useState(0);
  const [isIntro, setIsIntro] = useState(true);
  const [displayedText, setDisplayedText] = useState("");

  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);

  // ✅ State ใหม่: เก็บข้อความตอบกลับ และ Scene ถัดไปที่รออยู่
  const [responseText, setResponseText] = useState<string | null>(null);
  const [pendingNextScene, setPendingNextScene] = useState<string | null>(null);

  const currentScene: Scene = story[currentSceneKey] || story["start"];
  const isEnding = currentSceneKey === "ending"; // เช็คว่าเป็นฉากจบไหม

  // Logic เลือก Step ปัจจุบัน
  const currentStep = activeMemory
    ? (isIntro ? activeMemory.introSteps[introIndex] : null)
    : (isIntro ? currentScene.introSteps[introIndex] : null);

  // Logic เลือกรูปตัวละคร (ฉบับแก้บั๊ก)
  let activeImage = "";
  if (activeMemory) {
    const stepImg = isIntro ? activeMemory.introSteps[introIndex]?.image : undefined;
    if (stepImg !== undefined) {
      activeImage = stepImg;
    } else {
      activeImage = activeMemory.characterImage || "";
    }
  } else {
    const stepImg = isIntro ? currentScene.introSteps[introIndex]?.image : undefined;
    if (stepImg !== undefined) {
      activeImage = stepImg;
    } else {
      activeImage = currentScene.character || "";
    }
  }

  const activeSpeaker = currentStep?.speaker || currentScene.speaker || "Phu (ภู)";

  // ✅ คำนวณ Text ที่จะแสดง (รวมถึง Response Text ด้วย)
  let targetText = "";
  if (responseText) {
    targetText = responseText;
  } else if (activeMemory) {
    targetText = isIntro ? (activeMemory.introSteps[introIndex]?.text || "") : activeMemory.text;
  } else {
    targetText = isIntro ? (currentScene.introSteps[introIndex]?.text || "") : currentScene.text;
  }

  // Typewriter Effect
  useEffect(() => {
    if (!targetText) { setDisplayedText(""); return; }

    const segmenter = new Intl.Segmenter("th", { granularity: "grapheme" });
    const charArray = Array.from(segmenter.segment(targetText)).map(s => s.segment);
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayedText(charArray.slice(0, i).join(""));
      if (i >= charArray.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [targetText]);

  const handleNextDialogue = () => {
    // ✅ ถ้าแสดง Response อยู่ ให้กดแล้วไปต่อ
    if (responseText) {
      setResponseText(null);
      changeScene(pendingNextScene || "");
      return;
    }

    const currentSteps = activeMemory ? activeMemory.introSteps : currentScene.introSteps;
    if (isIntro) {
      if (introIndex < currentSteps.length - 1) {
        setIntroIndex((prev) => prev + 1);
      } else {
        setIsIntro(false);
      }
    }
  };

  const changeScene = (next: string) => {
    if (next === "") {
      setActiveMemory(null);
      setResponseText(null);
      return;
    }
    setHistory(prev => [...prev, currentSceneKey]);
    setCurrentSceneKey(next);
    setIntroIndex(0);
    setIsIntro(true);
    setActiveMemory(null);
    setResponseText(null);
  };

  // ✅ ฟังก์ชันจัดการเมื่อกดเลือก Choice
  const handleChoiceClick = (choice: Choice) => {
    if (choice.response) {
      setResponseText(choice.response);
      setPendingNextScene(choice.nextScene);
    } else {
      changeScene(choice.nextScene);
    }
  };

  const handleMemoryClick = (item: MemoryItem) => {
    setActiveMemory(item);
    setIntroIndex(0);
    setIsIntro(true);
    setResponseText(null);
  };

  const handleBack = () => {
    if (responseText) {
      setResponseText(null);
      return;
    }
    if (activeMemory) {
      setActiveMemory(null);
      return;
    }
    if (history.length > 0) {
      const prevScene = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentSceneKey(prevScene);
      setIntroIndex(0);
      setIsIntro(true);
      setActiveMemory(null);
      setResponseText(null);
    }
  };

  const PRELOAD_IMAGES = [
  "/room-bg.png",
  "/Phu+Sleeping.png",
  "/Phu+Hurt.png",
  "/Phu+angry.png",
  "/Phu+wakeup.png",
  "/Phu+Hi.png",
  "/Phu+idle.png",
  "/Phu+speak.png",
  "/Phu_figout.png",
  "/Phu+Thumpup.png",
  "/Phu+idk.png",
  "/Phu+ask.png",
  "/Phu+cheerup.png",
  "/Phu+smile.png",
  "/Phu_idle2.png",
  "/Phu+think.png",
  "/dog.png",
  // ... ใส่พวกรูป item/memory ให้ครบด้วยนะครับ
  "/item/item1.png",
  "/item/item2.png",
  "/item/item3.png",
  "/item/item4.png",
  "/item/item5.1.png",
  "/item/item5.22.png",
  "/item/item5.2.png",
  "/item/item5.3.png",
  "/item/item5.4.png",
  "/item/item5.5.png",
  "/item/item6.png",
];

  return (
    <main className={`relative w-screen h-screen overflow-hidden font-sans transition-colors duration-1000 ${isEnding ? "bg-black" : "bg-gray-900"}`}>

      {/* 1. BACKGROUND (ซ่อนถ้าเป็นฉากจบ) */}
      {!isEnding && (
        <div className={`absolute inset-0 bg-[url('/room-bg.png')] bg-cover bg-center transition-all duration-500 ${activeMemory ? "brightness-50 blur-sm" : "opacity-80"}`} />
      )}

      {/* 2. BACK BUTTON (ซ่อนถ้าเป็นฉากจบ) */}
      {!isEnding && (history.length > 0 || activeMemory) && (
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg font-bold transition-all border-2 border-pink-300"
        >
          ⬅️ ย้อนกลับ
        </button>
      )}

      {/* 3. MEMORY IMAGE */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute inset-0 z-10 flex items-center justify-center pb-32 pointer-events-none"
          >
            <div className="relative w-[300px] md:w-[500px] h-auto p-2 bg-white rounded-xl shadow-2xl rotate-[-2deg]">
              <Image
                src={
                  (isIntro && activeMemory.introSteps[introIndex]?.memoryImage)
                    ? activeMemory.introSteps[introIndex].memoryImage // ถ้า Step นี้มีรูป ให้ใช้รูปนี้
                    : activeMemory.memoryImage // ถ้าไม่มี ให้ใช้รูปหลัก
                }
                alt="Memory"
                width={500}
                height={350}
                className="w-full h-auto rounded-lg border border-gray-200"
                unoptimized
              />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-200/80 rotate-1 shadow-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CHARACTER (ซ่อนถ้าเป็นฉากจบ) */}
      <AnimatePresence mode="wait">
        {!isEnding && activeImage && (
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className={`absolute bottom-0 z-20 w-[300px] md:w-[750px] h-auto max-h-[90vh] transition-all duration-500 
                ${activeMemory ? "left-[60%] md:left-[55%]" : "left-[5%] md:left-[15%]"} 
            `}
          >
            <Image
              src={activeImage}
              alt="character"
              width={600}
              height={800}
              className="w-full h-full object-contain drop-shadow-2xl"
              unoptimized
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. GALLERY ICONS */}
      {currentScene.isGallery && currentScene.galleryItems && !activeMemory && !isEnding && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {currentScene.galleryItems.map((item: MemoryItem) => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMemoryClick(item)}
              className="absolute w-16 h-16 bg-white/90 rounded-full border-4 border-pink-400 shadow-xl flex items-center justify-center text-3xl cursor-pointer pointer-events-auto hover:bg-pink-100 transition-colors"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.icon}
            </motion.button>
          ))}
        </div>
      )}

      {/* 6. MAIN DIALOGUE BOX (ฉากปกติ) vs ENDING TEXT (ฉากจบ) */}

      {isEnding ? (
        // --- ส่วนแสดงผลฉากจบ (จอดำ ตัวหนังสือกลางจอ) ---
        <div
          onClick={handleNextDialogue}
          className="absolute inset-0 flex items-center justify-center p-8 cursor-pointer z-50"
        >
          <motion.div
            key={displayedText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-white text-3xl md:text-5xl font-light leading-relaxed tracking-wide">
              {displayedText}
            </h1>
            {isIntro && <p className="text-gray-500 text-sm mt-8 animate-pulse">(แตะเพื่อไปต่อ)</p>}
          </motion.div>
        </div>
      ) : (
        // --- ส่วนแสดงผลปกติ (กล่องข้อความ) ---
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-center">
          <div
            onClick={isIntro || responseText ? handleNextDialogue : undefined}
            className={`
                w-full max-w-5xl h-[200px] md:h-[250px]
                bg-pink-500/90 backdrop-blur-md 
                border-4 border-white rounded-3xl 
                shadow-2xl p-6 md:p-10 relative
                flex flex-col
                ${(isIntro || responseText) ? "cursor-pointer active:scale-[0.99]" : ""} 
            `}
          >
            {activeSpeaker && (
              <div className="absolute -top-6 left-10 bg-white px-6 py-2 rounded-full border-4 border-pink-400 font-bold text-pink-600 text-xl shadow-lg transition-all">
                {activeSpeaker}
              </div>
            )}

            <div className="text-white text-xl md:text-3xl leading-relaxed drop-shadow-md font-medium mt-4">
              {displayedText}
              <span className="animate-pulse">|</span>
            </div>

            {(isIntro || responseText) && (
              <div className="absolute bottom-4 right-6 text-white text-lg animate-bounce">
                ▼ คลิกเพื่อไปต่อ
              </div>
            )}

            {!isIntro && !responseText && (
              <div className="absolute -top-[200px] left-0 right-0 flex flex-col items-center gap-4 pointer-events-none">
                {(activeMemory ? activeMemory.choices : currentScene.choices).map((choice: Choice, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleChoiceClick(choice)}
                    className="bg-white hover:bg-pink-100 text-pink-600 border-4 border-pink-300 px-10 py-4 rounded-2xl text-xl font-bold shadow-xl transition-transform hover:scale-105 pointer-events-auto w-auto min-w-[300px]"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="hidden">
        {PRELOAD_IMAGES.map((src, index) => (
          <Image 
            key={index}
            src={src} 
            alt="preload" 
            width={1} 
            height={1} 
            priority // สั่งให้โหลดทันที!
            unoptimized // ให้โหลดไฟล์ต้นฉบับมารอ
          />
        ))}
      </div>
    </main>
  );
}