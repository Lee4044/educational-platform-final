import React, { useState } from 'react';

const steps = [
  {
    img: "/images/word_1.png",
    text: "أول خطوة هي الضغط على قائمة إدراج من قائمة المهام",
    highlightStyle: { top: "16px", left: "41px", width: "18px", height: "10px" , },
  },
  {
    img: "/images/word_2.png",
    text: "الخطوة الثانية: اختر 'جدول' من قائمة الإدراج",
    highlightStyle: { top: "11%", left: "8.7%", width: "24px", height: "40px" },
  },
  {
    img: "/images/word_3.png",
    text: "الخطوة الثالثة: الضغط على إدراج الجدول",
    highlightStyle: { top: "54%", left: "10%", width: "78px", height: "21px" },
  },
  {
    img: "/images/word_4.png",
    text: "الخطوة الرابعة: تحديد عدد الصفوف والأعمدة...",
    highlightStyle: { top: "31%", left: "40.3%", width: "90px", height: "40px" },
  },
  {
    img: "/images/word_4.png",
    text: "الخطوة الخامسة: اضغط على زر 'موافق' لإدراج الجدول",
    highlightStyle: { top: "64%", left: "42.4%", width: "46px", height: "18px" },
  },
  {
    img: "/images/word_5.png",
    text: "الخطوة الأخيرة: تم إدراج الجدول بنجاح، تهانينا!",
  },
];

export default function Scenario1() {
  const [step, setStep] = useState(0);

  const changeStep = (delta) =>
    setStep((s) => (s + delta + steps.length) % steps.length);

  const { img, text, highlightStyle } = steps[step];

  return (
    <div style={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
      <div
        id="excelSim"
        style={{
          position: "relative",
          width: "500px",
          paddingTop: "252px", 
          backgroundImage: `url(${img})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top left",
          border: "1px solid #ccc",
        }}
      >
        {highlightStyle && (
          <div
            style={{
              position: "absolute",
              cursor: "pointer",
              zIndex: 5,
              border: "2px solid red",
              backgroundColor: "transparent",
              ...highlightStyle,
            }}
            title="انقر هنا للانتقال للخطوة التالية"
            onClick={() => changeStep(1)}
          />
        )}
      </div>
      <h2 style={{ marginTop: 15 }}>{text}</h2>
      {step > 0 && (
       <button
         onClick={() => changeStep(-1)}
         style={{ marginTop: 10 }}
        >
    العودة للخطوة السابقة
         </button>
)}
    </div>
  );
}
