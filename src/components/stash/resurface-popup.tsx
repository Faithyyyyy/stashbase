// "use client";

// import { useEffect, useState } from "react";
// import { getResurface, ResurfaceItem } from "@/lib/resurface";
// import { getStashes } from "@/lib/stash";
// import { Stash } from "@/types";
// import { IcX } from "@/icons/icons";
// import { useAuth } from "@/context/AuthContext";

// export default function ResurfacePopup() {
//   const { user } = useAuth();
//   const [resurface, setResurface] = useState<ResurfaceItem | null>(null);
//   const [stash, setStash] = useState<Stash | null>(null);
//   const [visible, setVisible] = useState(false);
//   const [dismissed, setDismissed] = useState(false);

//   useEffect(() => {
//     if (!user) return;
//     // wait 3 seconds before showing
//     const timer = setTimeout(() => {
//       Promise.resolve().then(async () => {
//         try {
//           const data = await getResurface();
//           setResurface(data);

//           // fetch the stash details to get the title
//           const stashesData = await getStashes();
//           const found = stashesData.allStashes.find(
//             (s) => s.id === data.stashId,
//           );
//           if (found) setStash(found);
//           setVisible(true);
//         } catch {
//           // silently fail — resurface is non-critical
//         }
//       });
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [user]);

//   const handleDismiss = () => {
//     setVisible(false);
//     setTimeout(() => setDismissed(true), 300);
//   };

//   const handleView = () => {
//     if (!stash) return;
//     switch (stash.contentType) {
//       case "link":
//         window.open(stash.url, "_blank");
//         break;
//       case "document":
//         window.open(
//           `https://docs.google.com/viewer?url=${encodeURIComponent(
//             stash.metadata?.cloudinaryUrl ?? stash.url,
//           )}&embedded=false`,
//           "_blank",
//         );
//         break;
//       default:
//         window.open(stash.metadata?.cloudinaryUrl ?? stash.url, "_blank");
//     }
//     handleDismiss();
//   };

//   if (dismissed || !resurface) return null;

//   return (
//     <div
//       className="fixed bottom-6 left-1/2 z-50 transition-all duration-300"
//       style={{
//         transform: visible
//           ? "translateX(-50%) translateY(0)"
//           : "translateX(-50%) translateY(20px)",
//         opacity: visible ? 1 : 0,
//       }}
//     >
//       <div
//         className="rounded-sm px-5 py-4 pb-6 flex flex-col gap-3 shadow-lg"
//         style={{
//           backgroundColor: "#022B3A",
//           minWidth: "514px",
//           maxWidth: "514px",
//         }}
//       >
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex-1 min-w-0">
//             <p className="text-white font-semibold text-sm mb-1">
//               Stash Reminder
//             </p>
//             <p className="text-white/70 text-sm leading-relaxed">
//               {resurface.reason}
//             </p>
//           </div>
//           <button
//             onClick={handleDismiss}
//             className="text-white/50 hover:text-white transition-colors shrink-0 mt-0.5"
//           >
//             <IcX size={24} color="#fff" />
//           </button>
//         </div>

//         <button
//           onClick={handleView}
//           className="self-start px-4 py-2 bg-white text-[#022B3A] text-sm font-semibold rounded-sm hover:bg-gray-100 transition-colors"
//         >
//           View
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getResurface, postInteraction } from "@/lib/resurface";
import { api } from "@/lib/api";
import { Stash } from "@/types";
import { IcX } from "@/icons/icons";
import { useAuth } from "@/context/AuthContext";

export default function ResurfacePopup() {
  const { user } = useAuth();
  const [stashId, setStashId] = useState<string | null>(null);
  const [stash, setStash] = useState<Stash | null>(null);
  const [reason, setReason] = useState("");
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showSnooze, setShowSnooze] = useState(false);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      Promise.resolve().then(async () => {
        try {
          const data = await getResurface();
          setStashId(data.stashId);
          setReason(data.reason);

          // fetch the individual stash
          const res = await api<{ success: boolean; data: Stash }>(
            `/api/stashes/${data.stashId}`,
          );
          setStash(res.data);
          setVisible(true);

          // record "opened"
          await postInteraction({ stashId: data.stashId, action: "opened" });
        } catch {
          // silently fail
        }
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = async () => {
    setVisible(false);
    setTimeout(() => setDismissed(true), 300);
    if (stashId) {
      await postInteraction({ stashId, action: "dismissed" }).catch(() => {});
    }
  };

  const handleView = () => {
    if (!stash) return;
    switch (stash.contentType) {
      case "link":
        window.open(stash.url, "_blank");
        break;
      case "document":
        window.open(
          `https://docs.google.com/viewer?url=${encodeURIComponent(
            stash.metadata?.cloudinaryUrl ?? stash.url,
          )}`,
          "_blank",
        );
        break;
      default:
        window.open(stash.metadata?.cloudinaryUrl ?? stash.url, "_blank");
    }
  };

  const handleRate = async (stars: number) => {
    setRating(stars);
    if (stashId) {
      await postInteraction({
        stashId,
        action: "rated",
        rating: stars,
      }).catch(() => {});
    }
  };

  const handleSnooze = async (label: string) => {
    setShowSnooze(false);
    setVisible(false);
    setTimeout(() => setDismissed(true), 300);
    if (stashId) {
      await postInteraction({ stashId, action: "snoozed" }).catch(() => {});
    }
  };

  if (dismissed || !stash) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 transition-all duration-300"
      style={{
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(20px)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="rounded-sm px-5 py-4 pb-6 flex flex-col gap-3 shadow-lg"
        style={{
          backgroundColor: "#022B3A",
          minWidth: "514px",
          maxWidth: "514px",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm mb-1">
              Stash Reminder
            </p>
            <p className="text-white/70 text-sm leading-relaxed">{reason}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/50 hover:text-white transition-colors shrink-0 mt-0.5"
          >
            <IcX size={18} />
          </button>
        </div>

        {/* Stash title */}
        <p className="text-white/90 text-xs font-medium truncate  pt-2">
          {stash.title}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleView}
            className="px-4 py-2 bg-white text-[#022B3A] text-sm font-semibold rounded-sm hover:bg-gray-100 transition-colors"
          >
            View
          </button>

          {/* Snooze */}
          <div className="relative">
            <button
              onClick={() => setShowSnooze((o) => !o)}
              className="px-4 py-2 text-white/70 text-sm font-medium rounded-sm hover:text-white hover:bg-white/10 transition-colors"
            >
              Snooze
            </button>
            {showSnooze && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg py-1 w-40 z-10">
                {["1 hour", "Tomorrow", "Next week"].map((label) => (
                  <button
                    key={label}
                    onClick={() => handleSnooze(label)}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-base transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/50 text-sm font-medium rounded-sm hover:text-white hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { IcX } from "@/icons/icons";

// export default function ResurfacePopup() {
//   const [visible, setVisible] = useState(true);
//   const [dismissed, setDismissed] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [showSnooze, setShowSnooze] = useState(false);

//   const handleDismiss = () => {
//     setVisible(false);
//     setTimeout(() => setDismissed(true), 300);
//   };

//   if (dismissed) return null;

//   return (
//     <div
//       className="fixed bottom-6 left-1/2 z-50 transition-all duration-300"
//       style={{
//         transform: visible
//           ? "translateX(-50%) translateY(0)"
//           : "translateX(-50%) translateY(20px)",
//         opacity: visible ? 1 : 0,
//       }}
//     >
//       <div
//         className="rounded-lg px-5 py-4 flex flex-col gap-3 shadow-lg"
//         style={{
//           backgroundColor: "#022B3A",
//           minWidth: "514px",
//           maxWidth: "514px",
//         }}
//       >
//         {/* Header */}
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex-1 min-w-0">
//             <p className="text-white font-semibold text-sm mb-1">
//               Stash Reminder
//             </p>
//             <p className="text-white/70 text-sm leading-relaxed">
//               You saved this article 2 weeks ago
//             </p>
//           </div>
//           <button
//             onClick={handleDismiss}
//             className="text-white/50 hover:text-white transition-colors shrink-0 mt-0.5"
//           >
//             <IcX size={18} />
//           </button>
//         </div>

//         {/* Stash title */}
//         <p className="text-white/90 text-xs font-medium truncate border-t border-white/10 pt-2">
//           Learning React in 2026
//         </p>

//         {/* Star rating */}
//         {/* <div className="flex items-center gap-1">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <button
//               key={star}
//               onMouseEnter={() => setHoverRating(star)}
//               onMouseLeave={() => setHoverRating(0)}
//               onClick={() => setRating(star)}
//               className="transition-colors"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill={(hoverRating || rating) >= star ? "white" : "none"}
//                 stroke="white"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ opacity: (hoverRating || rating) >= star ? 1 : 0.4 }}
//               >
//                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//               </svg>
//             </button>
//           ))}
//           {rating > 0 && (
//             <span className="text-white/50 text-xs ml-1">Rated {rating}/5</span>
//           )}
//         </div> */}

//         {/* Actions */}
//         <div className="flex items-center gap-2 relative">
//           <button className="px-4 py-2 bg-white text-[#022B3A] text-sm font-semibold rounded-sm hover:bg-gray-100 transition-colors">
//             View
//           </button>
//           <div className="relative">
//             <button
//               onClick={() => setShowSnooze((o) => !o)}
//               className="px-4 py-2 text-white/70 text-sm font-medium rounded-sm hover:text-white hover:bg-white/10 transition-colors"
//             >
//               Snooze
//             </button>
//             {showSnooze && (
//               <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg py-1 w-40 z-10">
//                 {["1 hour", "Tomorrow", "Next week"].map((label) => (
//                   <button
//                     key={label}
//                     onClick={() => {
//                       setShowSnooze(false);
//                       handleDismiss();
//                     }}
//                     className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-base transition-colors"
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           <button
//             onClick={handleDismiss}
//             className="px-4 py-2 text-white/50 text-sm font-medium rounded-sm hover:text-white hover:bg-white/10 transition-colors"
//           >
//             Dismiss
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
