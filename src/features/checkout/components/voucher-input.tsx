/**
 * VoucherInput Component
 * Input field for applying voucher codes
 */

import { useState } from "react";
import { Check, X, Tag } from "lucide-react";
import type { AppliedVoucher } from "../types";

interface VoucherInputProps {
	onApply?: (code: string) => Promise<void>;
	onRemove?: () => void;
	appliedVoucher?: AppliedVoucher | null;
	disabled?: boolean;
}

export function VoucherInput({
	onApply,
	onRemove,
	appliedVoucher,
	disabled = false,
}: VoucherInputProps) {
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!code.trim() || loading || disabled || !onApply) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await onApply(code.trim().toUpperCase());
			setCode("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to apply voucher");
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = () => {
		if (onRemove) {
			onRemove();
		}
	};

	const handleChange = (value: string) => {
		setCode(value.toUpperCase());
		setError(null);
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 mb-2">
				<Tag className="w-5 h-5 text-violet-600" strokeWidth={2} />
				<span className="text-sm font-semibold text-gray-900">
					Voucher Code
				</span>
			</div>

			{appliedVoucher ? (
				// Applied State
				<div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
								<Check className="w-6 h-6 text-white" strokeWidth={3} />
							</div>
							<div>
								<p className="text-sm font-bold text-emerald-900">
									Voucher applied!
								</p>
								<p className="text-lg font-bold text-emerald-700">
									Save Rp {appliedVoucher.discount.toLocaleString("id-ID")}
								</p>
							</div>
						</div>
						<button
							onClick={handleRemove}
							disabled={disabled}
							className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							title="Remove voucher"
						>
							<X className="w-5 h-5" strokeWidth={2} />
						</button>
					</div>
				</div>
			) : (
				// Input State
				<form onSubmit={handleSubmit} className="space-y-2">
					<div className="flex gap-2">
						<input
							type="text"
							value={code}
							onChange={(e) => handleChange(e.target.value)}
							placeholder="e.g., SAVE10"
							disabled={disabled || loading}
							maxLength={20}
							className={`
                flex-1 px-4 py-3 border-2 rounded-xl font-mono text-sm uppercase tracking-wider
                transition-all duration-200
                ${
									error
										? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
										: "border-gray-200 bg-white focus:border-violet-400 focus:ring-violet-400"
								}
                focus:outline-none focus:ring-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
						/>
						<button
							type="submit"
							disabled={!code.trim() || loading || disabled}
							className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-600"
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							) : (
								"Apply"
							)}
						</button>
					</div>

					{/* Error Message */}
					{error && (
						<div className="flex items-center gap-2 text-sm text-red-600">
							<X className="w-4 h-4" strokeWidth={2} />
							<span>{error}</span>
						</div>
					)}

					{/* Helper Text */}
					{!error && (
						<p className="text-xs text-gray-500">
							Enter a voucher code to get discount on your order
						</p>
					)}
				</form>
			)}
		</div>
	);
}
