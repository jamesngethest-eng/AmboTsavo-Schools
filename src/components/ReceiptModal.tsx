import React from 'react';
import { X, Printer, Download, School, CheckCircle2 } from 'lucide-react';
import { Student, PaymentReceipt } from '../types';

interface ReceiptModalProps {
  student: Student;
  receipt: PaymentReceipt;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  student,
  receipt,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* School Header */}
        <div className="text-center pb-6 border-b border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center mx-auto mb-2">
            <School className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            AMBOTSAVO SCHOOLS
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Kajiado Town Campus &middot; Kimana Amboseli Campus, Kenya
          </p>
          <div className="text-[11px] text-slate-400 mt-1">
            Ministry of Education Reg: MOE/KJD/EY/8821 &middot; P.O. Box 244-01100 Kajiado
          </div>
          <div className="mt-3 inline-block bg-emerald-100 text-emerald-900 text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
            Official Fees Payment Receipt
          </div>
        </div>

        {/* Receipt Content */}
        <div className="py-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block text-[11px]">Receipt Number</span>
              <span className="font-mono font-bold text-slate-900">{receipt.id.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Date Issued</span>
              <span className="text-slate-800">{receipt.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">M-Pesa Reference</span>
              <span className="font-mono font-bold text-emerald-800">{receipt.mpesaRef}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Academic Term</span>
              <span className="text-slate-800">{receipt.term}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Learner Name:</span>
              <strong className="text-slate-900">{student.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student Reg No:</span>
              <span className="font-mono text-slate-800">{student.studentRegNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Grade Level:</span>
              <span className="text-slate-800">{student.grade} ({student.age} Years)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Campus:</span>
              <span className="text-slate-800">{student.campus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Parent / Guardian:</span>
              <span className="text-slate-800">{student.parentName}</span>
            </div>
          </div>

          <div className="border-t border-b border-slate-200 py-3 flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-900">Total Amount Received</span>
            <span className="text-emerald-800 font-mono text-base">
              KES {receipt.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Payment Channel: {receipt.method}</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: Cleared &amp; Verified
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
