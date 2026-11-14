import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FarmContext } from '../context/FarmContext';

const VET_PROTO_SYNC_CSS = "/* ==========================================================================\n   Estilos Nativos S\u00edncronos del M\u00f3dulo Veterinario (Sin dependencia de CDN)\n   Se carga instant\u00e1neamente con Vite al entrar al rol o presionar F5\n   ========================================================================== */\n\n.vet-proto-scope,\n.vet-proto-scope *,\n.vet-proto-scope *::before,\n.vet-proto-scope *::after {\n  box-sizing: border-box;\n  border-width: 0;\n  border-style: solid;\n  border-color: #e7e5e4;\n}\n\n.vet-proto-scope {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  line-height: 1.5;\n  color: #0f172a;\n  background-color: #FAF8F2;\n  width: 100%;\n  min-height: 100vh;\n  display: flex;\n  align-items: stretch;\n  position: relative;\n}\n\n.vet-proto-scope svg {\n  display: block;\n  vertical-align: middle;\n  flex-shrink: 0;\n}\n\n.vet-proto-scope h1,\n.vet-proto-scope h2,\n.vet-proto-scope h3,\n.vet-proto-scope h4,\n.vet-proto-scope p,\n.vet-proto-scope ul {\n  margin: 0;\n}\n\n.vet-proto-scope button,\n.vet-proto-scope input,\n.vet-proto-scope select,\n.vet-proto-scope textarea {\n  font-family: inherit;\n  font-size: 100%;\n  line-height: inherit;\n  color: inherit;\n  margin: 0;\n}\n\n.vet-proto-scope button {\n  background-color: transparent;\n  background-image: none;\n  cursor: pointer;\n}\n\n.vet-proto-scope table {\n  text-indent: 0;\n  border-color: inherit;\n  border-collapse: collapse;\n}\n\n/* Display & Layout */\n.vet-proto-scope .block { display: block; }\n.vet-proto-scope .inline-block { display: inline-block; }\n.vet-proto-scope .flex { display: flex; }\n.vet-proto-scope .inline-flex { display: inline-flex; }\n.vet-proto-scope .grid { display: grid; }\n.vet-proto-scope .hidden { display: none; }\n\n.vet-proto-scope .flex-col { flex-direction: column; }\n.vet-proto-scope .flex-wrap { flex-wrap: wrap; }\n.vet-proto-scope .flex-1 { flex: 1 1 0%; }\n.vet-proto-scope .shrink-0 { flex-shrink: 0; }\n.vet-proto-scope .self-stretch { align-self: stretch; }\n\n.vet-proto-scope .items-start { align-items: flex-start; }\n.vet-proto-scope .items-center { align-items: center; }\n.vet-proto-scope .items-baseline { align-items: baseline; }\n.vet-proto-scope .items-stretch { align-items: stretch; }\n.vet-proto-scope .justify-center { justify-content: center; }\n.vet-proto-scope .justify-between { justify-content: space-between; }\n.vet-proto-scope .justify-end { justify-content: flex-end; }\n\n/* Grid Columns & Spans */\n.vet-proto-scope .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }\n.vet-proto-scope .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.vet-proto-scope .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n.vet-proto-scope .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }\n.vet-proto-scope .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }\n.vet-proto-scope .col-span-4 { grid-column: span 4 / span 4; }\n.vet-proto-scope .col-span-8 { grid-column: span 8 / span 8; }\n\n/* Gaps */\n.vet-proto-scope .gap-1 { gap: 0.25rem; }\n.vet-proto-scope .gap-1\\.5 { gap: 0.375rem; }\n.vet-proto-scope .gap-2 { gap: 0.5rem; }\n.vet-proto-scope .gap-2\\.5 { gap: 0.625rem; }\n.vet-proto-scope .gap-3 { gap: 0.75rem; }\n.vet-proto-scope .gap-3\\.5 { gap: 0.875rem; }\n.vet-proto-scope .gap-4 { gap: 1rem; }\n\n/* Space-Y */\n.vet-proto-scope .space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.375rem; }\n.vet-proto-scope .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }\n.vet-proto-scope .space-y-2\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.625rem; }\n.vet-proto-scope .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }\n.vet-proto-scope .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }\n\n/* Divide-Y */\n.vet-proto-scope .divide-y > :not([hidden]) ~ :not([hidden]) {\n  border-top-width: 1px;\n}\n.vet-proto-scope .divide-stone-200\\/70 > :not([hidden]) ~ :not([hidden]) {\n  border-color: rgba(231, 229, 228, 0.7);\n}\n\n/* Positioning */\n.vet-proto-scope .relative { position: relative; }\n.vet-proto-scope .absolute { position: absolute; }\n.vet-proto-scope .fixed { position: fixed; }\n.vet-proto-scope .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }\n.vet-proto-scope .right-0 { right: 0; }\n.vet-proto-scope .top-12 { top: 3rem; }\n.vet-proto-scope .left-3\\.5 { left: 0.875rem; }\n.vet-proto-scope .top-1\\/2 { top: 50%; }\n.vet-proto-scope .-translate-y-1\\/2 { transform: translateY(-50%); }\n.vet-proto-scope .z-30 { z-index: 30; }\n.vet-proto-scope .z-50 { z-index: 50; }\n\n/* Widths & Heights */\n.vet-proto-scope .w-1\\.5 { width: 0.375rem; }\n.vet-proto-scope .h-1\\.5 { height: 0.375rem; }\n.vet-proto-scope .h-2 { height: 0.5rem; }\n.vet-proto-scope .w-3 { width: 0.75rem; }\n.vet-proto-scope .h-3 { height: 0.75rem; }\n.vet-proto-scope .w-4 { width: 1rem; }\n.vet-proto-scope .h-4 { height: 1rem; }\n.vet-proto-scope .w-5 { width: 1.25rem; }\n.vet-proto-scope .h-5 { height: 1.25rem; }\n.vet-proto-scope .w-7 { width: 1.75rem; }\n.vet-proto-scope .h-7 { height: 1.75rem; }\n.vet-proto-scope .w-8 { width: 2rem; }\n.vet-proto-scope .h-8 { height: 2rem; }\n.vet-proto-scope .w-10 { width: 2.5rem; }\n.vet-proto-scope .h-10 { height: 2.5rem; }\n.vet-proto-scope .w-11 { width: 2.75rem; }\n.vet-proto-scope .h-11 { height: 2.75rem; }\n.vet-proto-scope .w-13 { width: 3.25rem; }\n.vet-proto-scope .h-13 { height: 3.25rem; }\n.vet-proto-scope .w-14 { width: 3.5rem; }\n.vet-proto-scope .h-14 { height: 3.5rem; }\n.vet-proto-scope .w-64 { width: 16rem; }\n.vet-proto-scope .w-full { width: 100%; }\n.vet-proto-scope .h-full { height: 100%; }\n.vet-proto-scope .h-\\[56px\\] { height: 56px; }\n.vet-proto-scope .min-h-0 { min-height: 0px; }\n.vet-proto-scope .min-h-screen { min-height: 100vh; }\n.vet-proto-scope .min-w-0 { min-width: 0px; }\n.vet-proto-scope .max-h-36 { max-height: 9rem; }\n.vet-proto-scope .max-w-\\[190px\\] { max-width: 190px; }\n\n.vet-proto-scope .w-\\[220px\\] { width: 220px; }\n.vet-proto-scope .w-\\[235px\\] { width: 235px; }\n.vet-proto-scope .w-\\[320px\\] { width: 320px; }\n.vet-proto-scope .w-\\[380px\\] { width: 380px; }\n.vet-proto-scope .w-\\[560px\\] { width: 560px; }\n.vet-proto-scope .w-\\[620px\\] { width: 620px; }\n.vet-proto-scope .w-\\[640px\\] { width: 640px; }\n.vet-proto-scope .w-\\[660px\\] { width: 660px; }\n.vet-proto-scope .w-\\[680px\\] { width: 680px; }\n\n/* Anchos porcentuales de columnas de tablas */\n.vet-proto-scope .w-\\[8\\%\\] { width: 8%; }\n.vet-proto-scope .w-\\[10\\%\\] { width: 10%; }\n.vet-proto-scope .w-\\[11\\%\\] { width: 11%; }\n.vet-proto-scope .w-\\[12\\%\\] { width: 12%; }\n.vet-proto-scope .w-\\[13\\%\\] { width: 13%; }\n.vet-proto-scope .w-\\[14\\%\\] { width: 14%; }\n.vet-proto-scope .w-\\[15\\%\\] { width: 15%; }\n.vet-proto-scope .w-\\[16\\%\\] { width: 16%; }\n.vet-proto-scope .w-\\[18\\%\\] { width: 18%; }\n.vet-proto-scope .w-\\[19\\%\\] { width: 19%; }\n.vet-proto-scope .w-\\[20\\%\\] { width: 20%; }\n.vet-proto-scope .w-\\[21\\%\\] { width: 21%; }\n.vet-proto-scope .w-\\[22\\%\\] { width: 22%; }\n.vet-proto-scope .w-\\[23\\%\\] { width: 23%; }\n.vet-proto-scope .w-\\[25\\%\\] { width: 25%; }\n.vet-proto-scope .w-\\[26\\%\\] { width: 26%; }\n.vet-proto-scope .w-\\[28\\%\\] { width: 28%; }\n.vet-proto-scope .w-\\[30\\%\\] { width: 30%; }\n.vet-proto-scope .w-\\[32\\%\\] { width: 32%; }\n.vet-proto-scope .w-\\[33\\%\\] { width: 33%; }\n.vet-proto-scope .w-\\[35\\%\\] { width: 35%; }\n\n/* Padding */\n.vet-proto-scope .p-0 { padding: 0; }\n.vet-proto-scope .p-1 { padding: 0.25rem; }\n.vet-proto-scope .p-2\\.5 { padding: 0.625rem; }\n.vet-proto-scope .p-3 { padding: 0.75rem; }\n.vet-proto-scope .p-3\\.5 { padding: 0.875rem; }\n.vet-proto-scope .p-4 { padding: 1rem; }\n.vet-proto-scope .p-5 { padding: 1.25rem; }\n.vet-proto-scope .p-6 { padding: 1.5rem; }\n\n.vet-proto-scope .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }\n.vet-proto-scope .px-1\\.5 { padding-left: 0.375rem; padding-right: 0.375rem; }\n.vet-proto-scope .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }\n.vet-proto-scope .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }\n.vet-proto-scope .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }\n.vet-proto-scope .px-3\\.5 { padding-left: 0.875rem; padding-right: 0.875rem; }\n.vet-proto-scope .px-4 { padding-left: 1rem; padding-right: 1rem; }\n.vet-proto-scope .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }\n.vet-proto-scope .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }\n.vet-proto-scope .px-8 { padding-left: 2rem; padding-right: 2rem; }\n\n.vet-proto-scope .py-0\\.2 { padding-top: 0.08rem; padding-bottom: 0.08rem; }\n.vet-proto-scope .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }\n.vet-proto-scope .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }\n.vet-proto-scope .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }\n.vet-proto-scope .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }\n.vet-proto-scope .py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }\n.vet-proto-scope .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }\n.vet-proto-scope .py-3\\.5 { padding-top: 0.875rem; padding-bottom: 0.875rem; }\n.vet-proto-scope .py-4 { padding-top: 1rem; padding-bottom: 1rem; }\n.vet-proto-scope .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }\n\n.vet-proto-scope .pt-1 { padding-top: 0.25rem; }\n.vet-proto-scope .pt-2 { padding-top: 0.5rem; }\n.vet-proto-scope .pt-3 { padding-top: 0.75rem; }\n.vet-proto-scope .pt-3\\.5 { padding-top: 0.875rem; }\n.vet-proto-scope .pb-2 { padding-bottom: 0.5rem; }\n.vet-proto-scope .pl-10 { padding-left: 2.5rem; }\n.vet-proto-scope .pr-4 { padding-right: 1rem; }\n\n/* Margin */\n.vet-proto-scope .m-0 { margin: 0; }\n.vet-proto-scope .my-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }\n.vet-proto-scope .my-auto { margin-top: auto; margin-bottom: auto; }\n.vet-proto-scope .mt-0\\.5 { margin-top: 0.125rem; }\n.vet-proto-scope .mt-1 { margin-top: 0.25rem; }\n.vet-proto-scope .mt-4 { margin-top: 1rem; }\n.vet-proto-scope .mb-0 { margin-bottom: 0; }\n.vet-proto-scope .mb-0\\.5 { margin-bottom: 0.125rem; }\n.vet-proto-scope .mb-1 { margin-bottom: 0.25rem; }\n.vet-proto-scope .mb-1\\.5 { margin-bottom: 0.375rem; }\n.vet-proto-scope .mb-2 { margin-bottom: 0.5rem; }\n.vet-proto-scope .mb-2\\.5 { margin-bottom: 0.625rem; }\n.vet-proto-scope .mb-4 { margin-bottom: 1rem; }\n.vet-proto-scope .mb-7 { margin-bottom: 1.75rem; }\n.vet-proto-scope .ml-3 { margin-left: 0.75rem; }\n\n/* Typography */\n.vet-proto-scope .text-\\[10px\\] { font-size: 10px; line-height: 1.35; }\n.vet-proto-scope .text-\\[11px\\] { font-size: 11px; line-height: 1.4; }\n.vet-proto-scope .text-xs { font-size: 0.75rem; line-height: 1rem; }\n.vet-proto-scope .text-sm { font-size: 0.875rem; line-height: 1.25rem; }\n.vet-proto-scope .text-base { font-size: 1rem; line-height: 1.5rem; }\n.vet-proto-scope .text-lg { font-size: 1.125rem; line-height: 1.75rem; }\n.vet-proto-scope .text-2xl { font-size: 1.5rem; line-height: 2rem; }\n\n.vet-proto-scope .font-normal { font-weight: 400; }\n.vet-proto-scope .font-medium { font-weight: 500; }\n.vet-proto-scope .font-semibold { font-weight: 600; }\n.vet-proto-scope .font-bold { font-weight: 700; }\n.vet-proto-scope .font-extrabold { font-weight: 800; }\n.vet-proto-scope .italic { font-style: italic; }\n.vet-proto-scope .uppercase { text-transform: uppercase; }\n.vet-proto-scope .underline { text-decoration: underline; }\n\n.vet-proto-scope .leading-tight { line-height: 1.25; }\n.vet-proto-scope .leading-snug { line-height: 1.375; }\n.vet-proto-scope .leading-relaxed { line-height: 1.625; }\n.vet-proto-scope .tracking-tight { letter-spacing: -0.025em; }\n.vet-proto-scope .tracking-wider { letter-spacing: 0.05em; }\n\n.vet-proto-scope .text-left { text-align: left; }\n.vet-proto-scope .text-center { text-align: center; }\n.vet-proto-scope .text-right { text-align: right; }\n.vet-proto-scope .whitespace-nowrap { white-space: nowrap; }\n.vet-proto-scope .truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* Text Colors */\n.vet-proto-scope .text-white { color: #ffffff; }\n.vet-proto-scope .text-\\[\\#0EA5E9\\] { color: #0EA5E9; }\n.vet-proto-scope .text-\\[\\#10B981\\] { color: #10B981; }\n.vet-proto-scope .text-\\[\\#185C2B\\] { color: #185C2B; }\n.vet-proto-scope .text-\\[\\#DC2626\\] { color: #DC2626; }\n.vet-proto-scope .text-\\[\\#F59E0B\\] { color: #F59E0B; }\n\n.vet-proto-scope .text-slate-400 { color: #94a3b8; }\n.vet-proto-scope .text-slate-500 { color: #64748b; }\n.vet-proto-scope .text-slate-600 { color: #475569; }\n.vet-proto-scope .text-slate-700 { color: #334155; }\n.vet-proto-scope .text-slate-800 { color: #1e293b; }\n.vet-proto-scope .text-slate-900 { color: #0f172a; }\n.vet-proto-scope .text-slate-950 { color: #020617; }\n\n.vet-proto-scope .text-stone-700 { color: #44403c; }\n.vet-proto-scope .text-stone-800 { color: #292524; }\n\n.vet-proto-scope .text-emerald-50 { color: #ecfdf5; }\n.vet-proto-scope .text-emerald-100\\/80 { color: rgba(209, 250, 229, 0.8); }\n.vet-proto-scope .text-emerald-300 { color: #6ee7b7; }\n.vet-proto-scope .text-emerald-700 { color: #047857; }\n.vet-proto-scope .text-emerald-800 { color: #065f46; }\n.vet-proto-scope .text-emerald-900 { color: #064e3b; }\n.vet-proto-scope .text-emerald-950 { color: #022c22; }\n\n.vet-proto-scope .text-amber-200 { color: #fde68a; }\n.vet-proto-scope .text-amber-700 { color: #b45309; }\n.vet-proto-scope .text-amber-800 { color: #92400e; }\n.vet-proto-scope .text-amber-900 { color: #78350f; }\n.vet-proto-scope .text-amber-950 { color: #451a03; }\n\n.vet-proto-scope .text-red-300 { color: #fca5a5; }\n.vet-proto-scope .text-red-600 { color: #dc2626; }\n.vet-proto-scope .text-red-600\\/90 { color: rgba(220, 38, 38, 0.9); }\n.vet-proto-scope .text-red-700 { color: #b91c1c; }\n.vet-proto-scope .text-red-800 { color: #991b1b; }\n.vet-proto-scope .text-red-900 { color: #7f1d1d; }\n.vet-proto-scope .text-red-950 { color: #450a0a; }\n\n.vet-proto-scope .text-sky-700 { color: #0369a1; }\n.vet-proto-scope .text-sky-800 { color: #075985; }\n.vet-proto-scope .text-sky-900 { color: #0c4a6e; }\n\n.vet-proto-scope .text-purple-800 { color: #6b21a8; }\n.vet-proto-scope .text-purple-900 { color: #581c87; }\n.vet-proto-scope .text-indigo-800 { color: #3730a3; }\n.vet-proto-scope .text-teal-800 { color: #115e59; }\n.vet-proto-scope .text-orange-800 { color: #9a3412; }\n\n/* Backgrounds */\n.vet-proto-scope .bg-transparent { background-color: transparent; }\n.vet-proto-scope .bg-white { background-color: #ffffff; }\n.vet-proto-scope .bg-\\[\\#10B981\\] { background-color: #10B981; }\n.vet-proto-scope .bg-\\[\\#185C2B\\] { background-color: #185C2B; }\n.vet-proto-scope .bg-\\[\\#B49B3E\\] { background-color: #B49B3E; }\n.vet-proto-scope .bg-\\[\\#DC2626\\] { background-color: #DC2626; }\n.vet-proto-scope .bg-\\[\\#F59E0B\\] { background-color: #F59E0B; }\n.vet-proto-scope .bg-\\[\\#FAF8F2\\] { background-color: #FAF8F2; }\n\n.vet-proto-scope .bg-slate-900\\/50 { background-color: rgba(15, 23, 42, 0.5); }\n.vet-proto-scope .bg-slate-900\\/55 { background-color: rgba(15, 23, 42, 0.55); }\n.vet-proto-scope .bg-slate-950 { background-color: #020617; }\n\n.vet-proto-scope .bg-stone-50 { background-color: #fafaf9; }\n.vet-proto-scope .bg-stone-50\\/50 { background-color: rgba(250, 250, 249, 0.5); }\n.vet-proto-scope .bg-stone-100 { background-color: #f5f5f4; }\n.vet-proto-scope .bg-stone-100\\/70 { background-color: rgba(245, 245, 244, 0.7); }\n.vet-proto-scope .bg-stone-100\\/90 { background-color: rgba(245, 245, 244, 0.9); }\n.vet-proto-scope .bg-stone-200 { background-color: #e7e5e4; }\n.vet-proto-scope .bg-stone-200\\/70 { background-color: rgba(231, 229, 228, 0.7); }\n.vet-proto-scope .bg-stone-800 { background-color: #292524; }\n\n.vet-proto-scope .bg-emerald-50 { background-color: #ecfdf5; }\n.vet-proto-scope .bg-emerald-50\\/50 { background-color: rgba(236, 253, 245, 0.5); }\n.vet-proto-scope .bg-emerald-50\\/60 { background-color: rgba(236, 253, 245, 0.6); }\n.vet-proto-scope .bg-emerald-100 { background-color: #d1fae5; }\n.vet-proto-scope .bg-emerald-500 { background-color: #10b981; }\n.vet-proto-scope .bg-emerald-600 { background-color: #059669; }\n\n.vet-proto-scope .bg-amber-50 { background-color: #fffbeb; }\n.vet-proto-scope .bg-amber-50\\/30 { background-color: rgba(255, 251, 235, 0.3); }\n.vet-proto-scope .bg-amber-50\\/35 { background-color: rgba(255, 251, 235, 0.35); }\n.vet-proto-scope .bg-amber-100 { background-color: #fef3c7; }\n.vet-proto-scope .bg-amber-400 { background-color: #fbbf24; }\n.vet-proto-scope .bg-amber-400\\/25 { background-color: rgba(251, 191, 36, 0.25); }\n.vet-proto-scope .bg-amber-500 { background-color: #f59e0b; }\n.vet-proto-scope .bg-amber-600 { background-color: #d97706; }\n\n.vet-proto-scope .bg-red-50 { background-color: #fef2f2; }\n.vet-proto-scope .bg-red-50\\/20 { background-color: rgba(254, 242, 242, 0.2); }\n.vet-proto-scope .bg-red-50\\/30 { background-color: rgba(254, 242, 242, 0.3); }\n.vet-proto-scope .bg-red-50\\/35 { background-color: rgba(254, 242, 242, 0.35); }\n.vet-proto-scope .bg-red-50\\/40 { background-color: rgba(254, 242, 242, 0.4); }\n.vet-proto-scope .bg-red-50\\/50 { background-color: rgba(254, 242, 242, 0.5); }\n.vet-proto-scope .bg-red-50\\/60 { background-color: rgba(254, 242, 242, 0.6); }\n.vet-proto-scope .bg-red-50\\/70 { background-color: rgba(254, 242, 242, 0.7); }\n.vet-proto-scope .bg-red-50\\/80 { background-color: rgba(254, 242, 242, 0.8); }\n.vet-proto-scope .bg-red-100 { background-color: #fee2e2; }\n.vet-proto-scope .bg-red-100\\/80 { background-color: rgba(254, 226, 226, 0.8); }\n.vet-proto-scope .bg-red-600 { background-color: #dc2626; }\n.vet-proto-scope .bg-red-800 { background-color: #991b1b; }\n.vet-proto-scope .bg-red-900 { background-color: #7f1d1d; }\n\n.vet-proto-scope .bg-sky-50 { background-color: #f0f9ff; }\n.vet-proto-scope .bg-sky-100 { background-color: #e0f2fe; }\n.vet-proto-scope .bg-sky-600 { background-color: #0284c7; }\n\n.vet-proto-scope .bg-purple-50 { background-color: #faf5ff; }\n.vet-proto-scope .bg-purple-100 { background-color: #f3e8ff; }\n.vet-proto-scope .bg-purple-600 { background-color: #9333ea; }\n.vet-proto-scope .bg-indigo-50 { background-color: #eef2ff; }\n.vet-proto-scope .bg-teal-50 { background-color: #f0fdfa; }\n.vet-proto-scope .bg-orange-50 { background-color: #fff7ed; }\n.vet-proto-scope .bg-orange-500 { background-color: #f97316; }\n\n/* Borders */\n.vet-proto-scope .border-0 { border-width: 0px; }\n.vet-proto-scope .border { border-width: 1px; }\n.vet-proto-scope .border-2 { border-width: 2px; }\n.vet-proto-scope .border-t { border-top-width: 1px; }\n.vet-proto-scope .border-b { border-bottom-width: 1px; }\n\n.vet-proto-scope .border-white\\/15 { border-color: rgba(255, 255, 255, 0.15); }\n.vet-proto-scope .border-\\[\\#185C2B\\] { border-color: #185C2B; }\n\n.vet-proto-scope .border-stone-100 { border-color: #f5f5f4; }\n.vet-proto-scope .border-stone-200 { border-color: #e7e5e4; }\n.vet-proto-scope .border-stone-200\\/60 { border-color: rgba(231, 229, 228, 0.6); }\n.vet-proto-scope .border-stone-200\\/70 { border-color: rgba(231, 229, 228, 0.7); }\n.vet-proto-scope .border-stone-200\\/80 { border-color: rgba(231, 229, 228, 0.8); }\n.vet-proto-scope .border-stone-200\\/90 { border-color: rgba(231, 229, 228, 0.9); }\n.vet-proto-scope .border-stone-300 { border-color: #d6d3d1; }\n.vet-proto-scope .border-stone-300\\/80 { border-color: rgba(214, 211, 209, 0.8); }\n\n.vet-proto-scope .border-emerald-100 { border-color: #d1fae5; }\n.vet-proto-scope .border-emerald-200 { border-color: #a7f3d0; }\n.vet-proto-scope .border-emerald-200\\/80 { border-color: rgba(167, 243, 208, 0.8); }\n.vet-proto-scope .border-emerald-300 { border-color: #6ee7b7; }\n\n.vet-proto-scope .border-amber-100 { border-color: #fef3c7; }\n.vet-proto-scope .border-amber-200 { border-color: #fde68a; }\n.vet-proto-scope .border-amber-300 { border-color: #fcd34d; }\n\n.vet-proto-scope .border-red-100 { border-color: #fee2e2; }\n.vet-proto-scope .border-red-200 { border-color: #fecaca; }\n.vet-proto-scope .border-red-200\\/60 { border-color: rgba(254, 202, 202, 0.6); }\n.vet-proto-scope .border-red-200\\/70 { border-color: rgba(254, 202, 202, 0.7); }\n.vet-proto-scope .border-red-200\\/80 { border-color: rgba(254, 202, 202, 0.8); }\n.vet-proto-scope .border-red-200\\/90 { border-color: rgba(254, 202, 202, 0.9); }\n.vet-proto-scope .border-red-300 { border-color: #fca5a5; }\n.vet-proto-scope .border-red-600 { border-color: #dc2626; }\n.vet-proto-scope .border-red-950 { border-color: #450a0a; }\n\n.vet-proto-scope .border-sky-100 { border-color: #e0f2fe; }\n.vet-proto-scope .border-sky-200 { border-color: #bae6fd; }\n.vet-proto-scope .border-sky-300 { border-color: #7dd3fc; }\n\n.vet-proto-scope .border-purple-200 { border-color: #e9d5ff; }\n.vet-proto-scope .border-indigo-200 { border-color: #c7d2fe; }\n.vet-proto-scope .border-teal-200 { border-color: #99f6e4; }\n.vet-proto-scope .border-orange-200 { border-color: #fed7aa; }\n\n/* Border Radius */\n.vet-proto-scope .rounded { border-radius: 0.25rem; }\n.vet-proto-scope .rounded-md { border-radius: 0.375rem; }\n.vet-proto-scope .rounded-lg { border-radius: 0.5rem; }\n.vet-proto-scope .rounded-xl { border-radius: 0.75rem; }\n.vet-proto-scope .rounded-2xl { border-radius: 1rem; }\n.vet-proto-scope .rounded-full { border-radius: 9999px; }\n\n/* Shadows & Effects */\n.vet-proto-scope .shadow-sm {\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n}\n.vet-proto-scope .shadow-xl {\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n}\n.vet-proto-scope .shadow-2xl {\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);\n}\n.vet-proto-scope .backdrop-blur-\\[2px\\] {\n  backdrop-filter: blur(2px);\n}\n\n/* Tables, Lists, Overflow & Misc */\n.vet-proto-scope .table-fixed { table-layout: fixed; }\n.vet-proto-scope .border-collapse { border-collapse: collapse; }\n.vet-proto-scope .list-disc { list-style-type: disc; }\n.vet-proto-scope .list-inside { list-style-position: inside; }\n.vet-proto-scope .overflow-hidden { overflow: hidden; }\n.vet-proto-scope .overflow-auto { overflow: auto; }\n.vet-proto-scope .resize-none { resize: none; }\n.vet-proto-scope .select-none { user-select: none; }\n.vet-proto-scope .cursor-pointer { cursor: pointer; }\n.vet-proto-scope .accent-\\[\\#185C2B\\] { accent-color: #185C2B; }\n.vet-proto-scope .accent-red-600 { accent-color: #dc2626; }\n.vet-proto-scope .transition {\n  transition-property: color, background-color, border-color, box-shadow, transform;\n  transition-duration: 150ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n/* Hover & Focus States */\n.vet-proto-scope .hover\\:bg-\\[\\#134821\\]:hover { background-color: #134821; }\n.vet-proto-scope .hover\\:bg-amber-50\\/60:hover { background-color: rgba(255, 251, 235, 0.6); }\n.vet-proto-scope .hover\\:bg-amber-600:hover { background-color: #d97706; }\n.vet-proto-scope .hover\\:bg-red-50:hover { background-color: #fef2f2; }\n.vet-proto-scope .hover\\:bg-red-50\\/50:hover { background-color: rgba(254, 242, 242, 0.5); }\n.vet-proto-scope .hover\\:bg-red-50\\/60:hover { background-color: rgba(254, 242, 242, 0.6); }\n.vet-proto-scope .hover\\:bg-red-50\\/70:hover { background-color: rgba(254, 242, 242, 0.7); }\n.vet-proto-scope .hover\\:bg-red-100\\/60:hover { background-color: rgba(254, 226, 226, 0.6); }\n.vet-proto-scope .hover\\:bg-red-200:hover { background-color: #fecaca; }\n.vet-proto-scope .hover\\:bg-red-700:hover { background-color: #b91c1c; }\n.vet-proto-scope .hover\\:bg-stone-50:hover { background-color: #fafaf9; }\n.vet-proto-scope .hover\\:bg-stone-50\\/80:hover { background-color: rgba(250, 250, 249, 0.8); }\n.vet-proto-scope .hover\\:bg-stone-100:hover { background-color: #f5f5f4; }\n.vet-proto-scope .hover\\:bg-stone-200\\/60:hover { background-color: rgba(231, 229, 228, 0.6); }\n.vet-proto-scope .hover\\:bg-stone-900:hover { background-color: #1c1917; }\n.vet-proto-scope .hover\\:bg-white\\/10:hover { background-color: rgba(255, 255, 255, 0.1); }\n.vet-proto-scope .hover\\:bg-white\\/60:hover { background-color: rgba(255, 255, 255, 0.6); }\n.vet-proto-scope .hover\\:bg-white\\/70:hover { background-color: rgba(255, 255, 255, 0.7); }\n\n.vet-proto-scope .hover\\:border-\\[\\#185C2B\\]:hover { border-color: #185C2B; }\n.vet-proto-scope .hover\\:border-amber-300:hover { border-color: #fcd34d; }\n.vet-proto-scope .hover\\:border-emerald-300:hover { border-color: #6ee7b7; }\n.vet-proto-scope .hover\\:border-red-300:hover { border-color: #fca5a5; }\n.vet-proto-scope .hover\\:border-red-600:hover { border-color: #dc2626; }\n.vet-proto-scope .hover\\:border-sky-300:hover { border-color: #7dd3fc; }\n\n.vet-proto-scope .hover\\:text-\\[\\#185C2B\\]:hover { color: #185C2B; }\n.vet-proto-scope .hover\\:text-slate-700:hover { color: #334155; }\n.vet-proto-scope .hover\\:underline:hover { text-decoration: underline; }\n\n.vet-proto-scope .focus\\:outline-none:focus { outline: none; }\n.vet-proto-scope .focus\\:border-\\[\\#185C2B\\]:focus { border-color: #185C2B; }\n";

// Inyección síncrona inmediata al evaluar el módulo (antes del primer render y en F5)
if (typeof document !== 'undefined') {
  let styleEl = document.getElementById('vet-proto-sync-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'vet-proto-sync-styles';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = VET_PROTO_SYNC_CSS;
}

function VetShell({ activeNav = 'inicio', headerLeft = null, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext) || {};
  const {
    vetSanitaryAlerts = [],
    vetIsolationRequests = [],
    vetBarns = [],
    vetSanitarySlaughterOrders = [],
    resetVetProtoData
  } = useContext(FarmContext) || {};

  const [menuOpen, setMenuOpen] = useState(false);
  const [resetToast, setResetToast] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const pendingAlertsCount = vetSanitaryAlerts.length;
  const pendingIsolationCount = vetIsolationRequests.filter(
    (r) => r.estado === 'PENDIENTE_VALIDACION'
  ).length;
  const isolatedBarnsCount = vetBarns.filter((b) => b.estado === 'AISLAMIENTO').length;
  const pendingSlaughterCount = vetSanitarySlaughterOrders.filter(
    (o) => o.estado === 'PENDIENTE_EJECUCION'
  ).length;

  const isGestionSanitaria =
    activeNav === 'gestion-sanitaria' ||
    location.pathname.includes('/enfermedades') ||
    location.pathname.includes('/medicinas') ||
    location.pathname.includes('/medicaciones');

  const isAislamientoDiagnostico =
    activeNav === 'aislamiento-diagnostico' ||
    location.pathname.includes('/aislamiento') ||
    location.pathname.includes('/diagnosticar');

  const isAlertas =
    activeNav === 'alertas' || location.pathname.includes('/alertas');

  const isOrdenes =
    activeNav === 'ordenes' || location.pathname.includes('/ordenes');

  const isInicio =
    activeNav === 'inicio' &&
    !isGestionSanitaria &&
    !isAislamientoDiagnostico &&
    !isAlertas &&
    !isOrdenes;

  const handleResetDemo = () => {
    if (resetVetProtoData) {
      resetVetProtoData();
      setMenuOpen(false);
      setResetToast('Datos iniciales restaurados.');
      setTimeout(() => setResetToast(''), 3200);
    }
  };

  const handleLogout = () => {
    setMenuOpen(false);
    if (auth.logout) auth.logout();
    navigate('/login');
  };

  return (
    <div
      className="vet-proto-scope w-full min-h-screen bg-[#FAF8F2] flex items-stretch relative select-none"
      style={{
        fontFamily: "'Inter', sans-serif",
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FAF8F2',
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative'
      }}
    >
      <style>{VET_PROTO_SYNC_CSS}</style>

      {/* 1. SIDEBAR IZQUIERDA (#185C2B) EXTENDIDA A TODO EL ALTO */}
      <aside
        className="w-[235px] min-h-screen self-stretch bg-[#185C2B] text-white flex flex-col justify-between py-5 px-4 shrink-0 select-none"
        style={{
          width: '235px',
          minHeight: '100vh',
          alignSelf: 'stretch',
          backgroundColor: '#185C2B',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Logo Granja Avícola */}
          <div
            className="flex flex-col items-center text-center mb-7 px-2 cursor-pointer"
            onClick={() => navigate('/veterinario')}
          >
            <div className="w-14 h-14 flex items-center justify-center mb-1.5">
              <svg
                className="w-13 h-13"
                width="52"
                height="52"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27 14C27 11.5 29.5 10 31.5 11.5C33 9.5 36 10.5 36 13C38 12.5 39.5 14.5 38 16.5"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 25C22 19.5 26.5 15 32 15C36.5 15 40 18 40 22.5C40 25 39 27.5 39 30C39 33 42 35 46 35C49 35 51.5 33.5 53 32C52.5 38.5 47 45 38.5 45C29.5 45 23 39 23 30.5C23 29 22.5 27.5 20 26.5L18 25.5L22 25Z"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="30" cy="21" r="1.8" fill="#F59E0B" />
                <path
                  d="M29 33C32 35.5 36.5 35.5 39.5 33"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M41 49C41 42 46 36 53 36C53 43 48 48 41 49Z"
                  stroke="#86EFAC"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 53L47 42"
                  stroke="#86EFAC"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-lg font-extrabold tracking-tight leading-tight text-white m-0">
              Granja Avícola
            </h1>
            <p className="text-[11px] text-emerald-100/80 font-medium mt-0.5 mb-0">
              Producción que alimenta
            </p>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1.5 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('/veterinario')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-left border-0 cursor-pointer ${
                isInicio
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
                  : 'bg-transparent text-emerald-50 hover:bg-white/10'
              }`}
            >
              <svg
                className={`w-5 h-5 shrink-0 ${isInicio ? 'text-slate-950' : 'text-emerald-300'}`}
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Inicio</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/veterinario/enfermedades')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition text-left border-0 cursor-pointer ${
                isGestionSanitaria
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
                  : 'bg-transparent text-emerald-50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 shrink-0 ${
                    isGestionSanitaria ? 'text-slate-950' : 'text-emerald-300'
                  }`}
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span>Gestión Sanitaria</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/veterinario/aislamiento')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition text-left border-0 cursor-pointer ${
                isAislamientoDiagnostico
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
                  : 'bg-transparent text-emerald-50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 shrink-0 ${
                    isAislamientoDiagnostico ? 'text-slate-950' : 'text-emerald-300'
                  }`}
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Aislamiento y Diagnóstico</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isAislamientoDiagnostico
                    ? 'bg-slate-950 text-[#F59E0B]'
                    : 'bg-amber-400/25 text-amber-200'
                }`}
              >
                {pendingIsolationCount + isolatedBarnsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/veterinario/alertas')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition text-left border-0 cursor-pointer ${
                isAlertas
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
                  : 'bg-transparent text-emerald-50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 shrink-0 ${
                    isAlertas ? 'text-slate-950' : 'text-red-300'
                  }`}
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Alertas Sanitarias</span>
              </div>
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {pendingAlertsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/veterinario/ordenes')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition text-left border-0 cursor-pointer ${
                isOrdenes
                  ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-sm'
                  : 'bg-transparent text-emerald-50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 shrink-0 ${
                    isOrdenes ? 'text-slate-950' : 'text-emerald-300'
                  }`}
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Órdenes de Sacrificio</span>
              </div>
              {pendingSlaughterCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {pendingSlaughterCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Pie de Sidebar en la parte inferior */}
        <div className="border-t border-white/15 pt-3.5 px-2 flex items-center gap-2.5 text-xs text-emerald-100/80">
          <svg
            className="w-5 h-5 text-emerald-300 shrink-0"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
            />
          </svg>
          <div className="leading-tight">
            <p className="font-semibold text-white m-0">Aves sanas</p>
            <p className="text-[11px] m-0">un mejor mañana</p>
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL DERECHA EXTENDIDA A TODO EL ALTO */}
      <div
        className="flex-1 flex flex-col min-h-screen min-w-0"
        style={{ flex: '1 1 0%', minHeight: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        <header
          className={`h-[56px] bg-white border-b border-stone-200/80 px-6 flex items-center ${
            headerLeft ? 'justify-between' : 'justify-end'
          } shrink-0 relative z-30`}
        >
          {headerLeft && <div>{headerLeft}</div>}

          <div className="flex items-center gap-3 relative" ref={menuRef}>
            {resetToast && (
              <span className="bg-emerald-50 text-[#185C2B] border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-lg">
                {resetToast}
              </span>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer py-1 px-2 rounded-xl hover:bg-stone-100 transition"
              title="Opciones de cuenta"
            >
              <span className="text-xs font-bold text-slate-700">Veterinario</span>
              <div className="w-8 h-8 rounded-full bg-[#B49B3E] text-white flex items-center justify-center shadow-sm">
                <svg
                  className="w-4 h-4"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs">
                <div className="px-4 py-2.5 border-b border-stone-100">
                  <p className="font-extrabold text-slate-900 m-0">
                    {auth.user?.name || 'Dr. Veterinario'}
                  </p>
                  <p className="text-[11px] text-slate-500 m-0">
                    {auth.user?.email || 'veterinario@avicontrol.com'}
                  </p>
                  <span className="inline-block mt-1 bg-emerald-50 text-[#185C2B] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ROL: VETERINARIO
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="w-full text-left px-4 py-2.5 hover:bg-stone-50 font-semibold text-amber-800 flex items-center gap-2 border-0 bg-transparent cursor-pointer"
                >
                  <span>🔄</span>
                  <span>Restaurar datos iniciales</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/roles');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-stone-50 font-semibold text-slate-700 flex items-center gap-2 border-0 bg-transparent cursor-pointer"
                >
                  <span>🔀</span>
                  <span>Cambiar de rol</span>
                </button>

                <div className="border-t border-stone-100 my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 font-bold text-red-600 flex items-center gap-2 border-0 bg-transparent cursor-pointer"
                >
                  <span>🚪</span>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

export default VetShell;
