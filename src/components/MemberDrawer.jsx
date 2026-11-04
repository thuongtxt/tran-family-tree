import React from 'react';
import {
	X,
	GitBranch
} from 'lucide-react';
export default function MemberDrawer({
	member,
	members,
	onClose,
	onEdit,
	onAdd,
	onToggle,
	collapsed,
	admin
}) {
	if (!member) return null;
	const spouse = members.find(m => m.id === member.spouseId || m.spouseId === member.id && m.id !== member.id);
	const children = members.filter(m => m.parentId === member.id || spouse && m.parentId === spouse.id);
	return < div className = "fixed inset-0 z-50 flex justify-end bg-black/30"
	onClick = {
		onClose
	} > < aside className = "h-full w-full max-w-md overflow-y-auto bg-[#fcfaf6] p-6 shadow-2xl"
	onClick = {
			e => e.stopPropagation()
		} > < div className = "flex justify-between items-center" > < span className = "text-sm font-semibold text-amber-800" > HỒ SƠ THÀNH VIÊN < /span><button onClick={onClose}><X/ > < /button></div > < div className = "mt-8 text-center" > < div className = "mx-auto grid h-20 w-20 place-items-center rounded-full bg-stone-200 text-2xl" > {
			member.avatarUrl ? < img src = {
				member.avatarUrl
			}
			className = "h-20 w-20 rounded-full object-cover" / > : member.gender === 'female' ? '👩' : '👨'
		} < /div><h2 className="mt-3 text-2xl font-bold">{member.fullName}</h2 > < p className = "text-stone-500" > Đời thứ {
			member.generation
		}· {
			member.branch || 'Chưa phân chi'
		} < /p></div > < div className = "mt-8 space-y-4 text-sm" > {
			[
				['Giới tính', member.gender === 'male' ? 'Nam' : 'Nữ'],
				['Ngày sinh', member.birthDate || 'Chưa cập nhật'],
				['Ngày mất / ngày giỗ', member.isAlive ? 'Còn sống' : member.deathDate || 'Chưa cập nhật'],
				['Loại ngày giỗ', member.deathCalendar === 'lunar' ? 'Âm lịch' : 'Dương lịch'],
				['Vai trò', member.parentId ? 'Huyết thống' : member.spouseId ? 'Dâu / rể' : 'Thủy tổ'],
				['Thứ tự trong gia đình', member.orderInFamily || '—'],
				['Vợ / chồng', spouse?.fullName || '—'],
				['Nơi an táng', member.burialPlace || '—'],
				['Tiểu sử', member.bio || 'Chưa cập nhật']
			].map(([k, v]) => < div key = {
					k
				}
				className = "border-b border-stone-200 pb-3" > < div className = "text-stone-500" > {
					k
				} < /div><div className="mt-1 font-medium">{v}</div > < /div>)}<div><div className="text-stone-500 mb-2">Con cháu ({children.length})</div > {
					children.map(c => < div key = {
							c.id
						}
						className = "py-1" > •{
							c.fullName
						} < /div>)}</div > < /div><button className="mt-6 flex items-center gap-2 text-amber-800" onClick={()=>onToggle(member.id)}><GitBranch size={16}/ > {
							collapsed.includes(member.id) ? 'Mở rộng' : 'Thu gọn'
						}
						nhánh hậu duệ < /button>{admin&&<div className="mt-6 flex flex-wrap gap-2"><button className="rounded-lg bg-amber-800 px-4 py-2 text-white" onClick={()=>onEdit(member)}>Sửa hồ sơ</button > {
							['child', 'spouse', 'parent'].map((r, i) => < button key = {
									r
								}
								className = "rounded-lg border border-stone-300 px-3 py-2"
								onClick = {
									() => onAdd(r, member)
								} > {
									['Thêm con', 'Thêm vợ/chồng', 'Thêm cha/mẹ'][i]
								} < /button>)}</div >
							} < /aside></div >
						}