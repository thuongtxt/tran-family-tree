import React from 'react';
import {
	Handle,
	Position
} from '@xyflow/react';
export default function MemberCard({
	data
}) {
	const m = data.member;
	return < div className = {
		`w-52 rounded-2xl border-2 bg-white shadow-md p-3 text-center ${m.gender==='female'?'border-rose-200':'border-slate-300'}`
	} > < Handle type = "target"
	position = {
		Position.Top
	}
	className = "!opacity-0" / > < div className = {
		`mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full text-lg font-bold ${m.gender==='female'?'bg-rose-100 text-rose-700':'bg-slate-100 text-slate-700'}`
	} > {
		m.avatarUrl ? < img src = {
			m.avatarUrl
		}
		alt = ""
		className = "h-12 w-12 rounded-full object-cover" / > : m.fullName.split(' ').slice(-2).map(s => s[0]).join('')
	} < /div><div className="font-semibold text-sm">{m.fullName}</div > < div className = "text-xs text-stone-500" > Đời thứ {
		m.generation
	}· {
		m.parentId ? 'Con cháu' : m.spouseId ? 'Dâu / rể' : 'Thủy tổ'
	} < /div><div className="mt-1 text-xs text-stone-500">{m.birthDate?.slice(0,4)||'?'} – {m.isAlive?'nay':m.deathDate?.slice(0,4)||'?'}</div > < Handle type = "source"
	position = {
		Position.Bottom
	}
	className = "!opacity-0" / > < /div>}