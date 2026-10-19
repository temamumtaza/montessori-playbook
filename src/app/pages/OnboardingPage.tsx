import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ageBandFromBirth, useChildStore } from '../stores/children'
import { ageBandById } from '../../content/meta'
import { AgeBandIcon, IconCalendar, IconCamera, IconChevronLeft, IconChevronRight, IconClose, IconHeart, IconShield, IconSparkle, IconStar } from '../components/ui-icons'
import type { AgeBandId } from '../../content/schema'

const AVATARS: AgeBandId[] = ['2-3y', '0-3m', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '3-4y']

export function OnboardingPage() {
  const navigate = useNavigate()
  const addChild = useChildStore((state) => state.addChild)
  const [step, setStep] = useState<1 | 2>(1)
  const [nickname, setNickname] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [multiChild, setMultiChild] = useState(() => localStorage.getItem('mp-multi-child') !== 'off')
  const avatar = AVATARS[avatarIndex]
  const canContinue = nickname.trim().length > 0 && birthDate.length > 0

  function setMultiChildPreference(value: boolean) {
    setMultiChild(value)
    localStorage.setItem('mp-multi-child', value ? 'on' : 'off')
  }

  function finish() {
    localStorage.setItem('mp-multi-child', multiChild ? 'on' : 'off')
    addChild(nickname.trim(), birthDate, avatar)
    navigate('/')
  }

  return (
    <div className="min-h-dvh bg-sky-50 dark:bg-navy-900 px-5 pt-safe pb-safe">
      <header className="flex items-center justify-between pt-3 pb-5">
        <button
          type="button"
          aria-label={step === 1 ? 'Kembali ke beranda' : 'Kembali ke langkah sebelumnya'}
          onClick={() => step === 2 ? setStep(1) : navigate('/')}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-sky-700 shadow-sm dark:bg-navy-800 dark:text-sky-300"
        >
          <IconChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2" aria-label={`Langkah ${step} dari 2`}>
          {[1, 2].map((dot) => <span key={dot} className={`h-2 rounded-full transition-all ${dot === step ? 'w-8 bg-sky-600' : 'w-2 bg-sky-200 dark:bg-navy-700'}`} />)}
        </div>
        <span className="w-11" aria-hidden />
      </header>

      <main className="mx-auto w-full max-w-md pb-8">
        {step === 1 ? (
          <ProfileStep
            avatar={avatar}
            avatarIndex={avatarIndex}
            nickname={nickname}
            birthDate={birthDate}
            multiChild={multiChild}
            canContinue={canContinue}
            onCycleAvatar={() => setAvatarIndex((current) => (current + 1) % AVATARS.length)}
            onNicknameChange={setNickname}
            onBirthDateChange={setBirthDate}
            onMultiChildChange={setMultiChildPreference}
            onContinue={() => setStep(2)}
          />
        ) : (
          <ConfirmStep avatar={avatar} nickname={nickname} birthDate={birthDate} onFinish={finish} />
        )}
      </main>
    </div>
  )
}

function Avatar({ band, avatarIndex, onClick, size = 'large' }: { band: AgeBandId; avatarIndex: number; onClick?: () => void; size?: 'large' | 'small' }) {
  const content = (
    <span className={`relative grid place-items-center rounded-full bg-sky-100 dark:bg-navy-700 ${size === 'large' ? 'h-36 w-36' : 'h-16 w-16'}`}>
      <AgeBandIcon band={band} className={size === 'large' ? 'h-28 w-28' : 'h-12 w-12'} />
      <IconStar className={`absolute text-sunny-500 ${size === 'large' ? 'right-3 top-2 h-5 w-5' : 'right-1 top-1 h-3.5 w-3.5'}`} />
      {size === 'large' && <span className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full bg-sky-600 text-white ring-4 ring-sky-50 dark:ring-navy-900"><IconCamera className="h-5 w-5" /></span>}
    </span>
  )
  return onClick ? <button type="button" aria-label={`Ganti avatar ${avatarIndex + 1}`} onClick={onClick} className="rounded-full active:scale-95 transition">{content}</button> : content
}

function ProfileStep(props: {
  avatar: AgeBandId; avatarIndex: number; nickname: string; birthDate: string; multiChild: boolean; canContinue: boolean
  onCycleAvatar: () => void; onNicknameChange: (value: string) => void; onBirthDateChange: (value: string) => void; onMultiChildChange: (value: boolean) => void; onContinue: () => void
}) {
  return (
    <section aria-labelledby="onboarding-title">
      <div className="text-center">
        <Avatar band={props.avatar} avatarIndex={props.avatarIndex} onClick={props.onCycleAvatar} />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Langkah 1 dari 2</p>
        <h1 id="onboarding-title" className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-sky-900 dark:text-sky-100">Buat Profil Anak</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed opacity-70">Selamat datang! Kenalkan si kecil agar rekomendasi aktivitas terasa lebih pas.</p>
      </div>

      <div className="mt-7 space-y-4 rounded-3xl bg-white p-5 shadow-sky-sm dark:bg-navy-800">
        <label className="block text-sm font-semibold" htmlFor="nickname">Nama Panggilan</label>
        <div className="relative">
          <input id="nickname" value={props.nickname} onChange={(event) => props.onNicknameChange(event.target.value)} placeholder="Nama panggilan" className="min-h-12 w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 pr-12 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-navy-700 dark:bg-navy-900" autoComplete="off" />
          {props.nickname && <button type="button" aria-label="Hapus nama panggilan" onClick={() => props.onNicknameChange('')} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-sky-600"><IconClose className="h-4 w-4" /></button>}
        </div>

        <label className="block text-sm font-semibold" htmlFor="birth-date">Tanggal Lahir</label>
        <div className="relative">
          <input id="birth-date" type="date" value={props.birthDate} onChange={(event) => props.onBirthDateChange(event.target.value)} className="min-h-12 w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 pr-12 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-navy-700 dark:bg-navy-900" />
          <IconCalendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600" />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-sky-100 pt-4 dark:border-navy-700">
          <div><p className="text-sm font-semibold">Bisa memilih beberapa anak</p><p className="mt-0.5 text-xs opacity-60">Tambah profil lain kapan saja</p></div>
          <button type="button" role="switch" aria-checked={props.multiChild} aria-label="Bisa memilih beberapa anak" onClick={() => props.onMultiChildChange(!props.multiChild)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${props.multiChild ? 'bg-sky-600' : 'bg-sky-200 dark:bg-navy-600'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${props.multiChild ? 'left-6' : 'left-1'}`} /></button>
        </div>
      </div>

      <button type="button" disabled={!props.canContinue} onClick={props.onContinue} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 font-semibold text-white shadow-md shadow-sky-600/20 transition enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40">Lanjut <IconChevronRight className="h-5 w-5" /></button>
    </section>
  )
}

function ConfirmStep({ avatar, nickname, birthDate, onFinish }: { avatar: AgeBandId; nickname: string; birthDate: string; onFinish: () => void }) {
  const band = ageBandFromBirth(birthDate)
  const bandLabel = ageBandById(band)?.label ?? band
  return (
    <section aria-labelledby="confirm-title">
      <div className="text-center"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Langkah 2 dari 2</p><h1 id="confirm-title" className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-sky-900 dark:text-sky-100">Konfirmasi</h1><p className="mt-2 text-sm opacity-70">Semua sudah siap untuk perjalanan kecil yang berarti.</p></div>
      <div className="mt-7 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sky-sm dark:bg-navy-800"><Avatar band={avatar} avatarIndex={0} /><div><p className="text-xl font-bold">{nickname}</p><p className="mt-1 text-sm opacity-70">Usia {bandLabel}</p><p className="mt-1 text-xs opacity-60">Lahir {birthDate}</p></div></div>
      <div className="mt-5 space-y-3 rounded-3xl bg-white p-5 shadow-sky-sm dark:bg-navy-800">
        <Value Icon={IconSparkle} text="Aktivitas sesuai usia" /><Value Icon={IconHeart} text="Catat momen tumbuh" /><Value Icon={IconShield} text="Data hanya di perangkat" />
      </div>
      <button type="button" onClick={onFinish} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 font-semibold text-white shadow-md shadow-sky-600/20 transition active:scale-95">Mulai Sekarang <IconChevronRight className="h-5 w-5" /></button>
    </section>
  )
}

function Value({ Icon, text }: { Icon: typeof IconSparkle; text: string }) {
  return <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-sky-600 dark:bg-navy-700"><Icon className="h-5 w-5" /></span><span className="text-sm font-medium">{text}</span></div>
}
