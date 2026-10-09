import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, X, Phone, DollarSign, Loader2 } from 'lucide-react';
import { Student, PaymentReceipt } from '../types';

interface PaymentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: PaymentReceipt) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(student.parentWhatsApp || '0712345678');
  const [amount, setAmount] = useState<number>(student.fees.balanceDue > 0 ? student.fees.balanceDue : 5000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);

  if (!isOpen) return null;

  const generateMpesaCode = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const nums = '0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 5; i++) code += nums.charAt(Math.floor(Math.random() * nums.length));
    code += letters.charAt(Math.floor(Math.random() * letters.length));
    return code;
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);

    // Simulate STK push and confirmation
    setTimeout(() => {
      const receipt: PaymentReceipt = {
        id: `pay-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: Number(amount),
        mpesaRef: generateMpesaCode(),
        method: `M-Pesa (Paybill 522123 / Acc: ${student.fees.accountNumber})`,
        term: student.fees.term,
      };

      setIsProcessing(false);
      setCompletedReceipt(receipt);
      onSuccess(receipt);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedReceipt ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Lipa Na M-Pesa School Fees
                </h3>
                <span className="text-[11px] text-slate-500">AmboTsavo Schools Paybill System</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 my-4 text-xs">
              <div className="flex justify-between items-center mb-1 text-slate-600">
                <span>Student:</span>
                <span className="font-semibold text-slate-900">{student.name}</span>
              </div>
              <div className="flex justify-between items-center mb-1 text-slate-600">
                <span>Grade / Reg:</span>
                <span className="font-semibold text-slate-900">{student.grade} &middot; {student.studentRegNo}</span>
              </div>
              <div className="flex justify-between items-center mb-1 text-slate-600">
                <span>Current Balance Due:</span>
                <span className="font-bold text-red-600 font-mono">
                  KES {student.fees.balanceDue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-emerald-200 text-slate-700">
                <span>Paybill: <strong className="font-mono text-emerald-900">522123</strong></span>
                <span>Account: <strong className="font-mono text-emerald-900">{student.fees.accountNumber}</strong></span>
              </div>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  M-Pesa Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0712345678 or 2547..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Amount to Pay (KES)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono font-bold text-xs">KES</span>
                  <input
                    type="number"
                    required
                    min={100}
                    max={student.fees.balanceDue > 0 ? student.fees.balanceDue : 50000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-3 py-2 border border-slate-300 rounded-lg font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[2000, 5000, student.fees.balanceDue].filter(v => v > 0).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-mono text-slate-700 cursor-pointer"
                    >
                      KES {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending M-Pesa STK Push...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Payment of KES {amount.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-normal">
                Prompt will appear on your phone asking for M-Pesa PIN. AmboTsavo School accounts reconcile instantly.
              </p>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold font-serif text-slate-900 mb-1">
              Payment Confirmed!
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              M-Pesa Reference <strong className="font-mono text-emerald-900">{completedReceipt.mpesaRef}</strong>
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Received:</span>
                <span className="font-bold text-slate-900 font-mono">KES {completedReceipt.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-medium text-slate-800">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Term:</span>
                <span className="text-slate-800">{completedReceipt.term}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date &amp; Time:</span>
                <span className="text-slate-800">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">New Outstanding Balance:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  KES {Math.max(0, student.fees.balanceDue - completedReceipt.amount).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs cursor-pointer"
            >
              Close &amp; View Updated Statement
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
