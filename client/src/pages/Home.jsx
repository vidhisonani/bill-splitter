import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { MdReceiptLong } from 'react-icons/md';

const demos = {
  trip: {
    label: 'Goa Trip',
    group: 'Goa Trip — March 2026',
    members: ['You', 'Rahul', 'Neha', 'Priya'],
    totalExpense: '₹38,400',
    youPaid: '₹24,000',
    youOwed: '₹18,000',
    expenses: [
      { title: 'Hotel booking', paidBy: 'You', amount: '₹24,000', note: 'You lent ₹18,000' },
      { title: 'Car rental', paidBy: 'Rahul', amount: '₹8,000', note: 'You owe ₹2,000' },
      { title: 'Beach dinner', paidBy: 'Neha', amount: '₹6,400', note: 'You owe ₹1,600' },
    ],
    balances: [
      { from: 'Rahul', to: 'You', amount: '₹4,000' },
      { from: 'Neha', to: 'You', amount: '₹6,000' },
      { from: 'Priya', to: 'You', amount: '₹8,000' },
    ],
  },
  flat: {
    label: 'Flat 4B',
    group: 'Flat 4B — Monthly',
    members: ['You', 'Amit', 'Sneha'],
    totalExpense: '₹41,100',
    youPaid: '₹3,600',
    youOwed: '₹12,500',
    expenses: [
      { title: 'Rent', paidBy: 'Amit', amount: '₹36,000', note: 'You owe ₹12,000' },
      { title: 'Electricity', paidBy: 'You', amount: '₹3,600', note: 'You lent ₹2,400' },
      { title: 'WiFi', paidBy: 'Sneha', amount: '₹1,500', note: 'You owe ₹500' },
    ],
    balances: [
      { from: 'You', to: 'Amit', amount: '₹10,100' },
      { from: 'Sneha', to: 'Amit', amount: '₹12,200' },
    ],
  },
  dinner: {
    label: 'Friday Dinner',
    group: 'Friday Night — 4 people',
    members: ['You', 'Vikram', 'Karan', 'Ananya'],
    totalExpense: '₹3,200',
    youPaid: '₹3,200',
    youOwed: '₹2,400',
    expenses: [
      { title: 'Pizza + drinks', paidBy: 'You', amount: '₹3,200', note: 'You lent ₹2,400' },
    ],
    balances: [
      { from: 'Vikram', to: 'You', amount: '₹800' },
      { from: 'Karan', to: 'You', amount: '₹800' },
      { from: 'Ananya', to: 'You', amount: '₹800' },
    ],
  },
};

export default function Home() {
  useDocumentTitle("Home | SplitEase");

  const [activeTab, setActiveTab] = useState('trip');
  const [demoTab, setDemoTab] = useState('expenses');
  const demo = demos[activeTab];

  return (
    <div className="min-h-screen bg-white text-slate-800">

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-700 transition">
              <MdReceiptLong size={22} />
            </div>
            <span className="text-2xl font-extrabold text-indigo-600 tracking-tight group-hover:text-indigo-700 transition">
              SplitEase
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">
              Sign in
            </Link>
            <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-16 text-center">
        <p className="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
          Built with React · Node.js · MongoDB
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5 max-w-3xl mx-auto">
          Split bills with friends.<br />
          <span className="text-indigo-600">Without the awkward maths.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto mb-8">
          Add an expense, choose who's splitting it, and SplitEase tells everyone exactly what they owe. Works for trips, flatmates, and dinners.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Try it free <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
          <a href="#demo" className="w-full sm:w-auto text-center text-sm text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition">
            See how it works
          </a>
        </div>
      </section>

      <section id="demo" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 scroll-mt-20">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Interactive demo — click a group to explore
        </p>

        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row bg-gray-50">
          <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-4 shrink-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Your groups</p>
            <div className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {Object.entries(demos).map(([key, d]) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setDemoTab('expenses'); }}
                  className={`whitespace-nowrap md:w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeTab === key
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 px-4 sm:px-6 py-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{demo.group}</h3>
                {demo.description && <p className="text-sm text-gray-500 mt-0.5">{demo.description}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-xs font-semibold text-gray-900 mb-1">Total Group Expenses</div>
                <div className="text-sm font-medium text-gray-500">{demo.totalExpense}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-xs font-semibold text-gray-900 mb-1">You Paid</div>
                <div className="text-sm font-medium text-green-500">{demo.youPaid}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-xs font-semibold text-gray-900 mb-1">You Are Owed</div>
                <div className="text-sm font-medium text-red-400">{demo.youOwed}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-4 h-fit">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Members ({demo.members.length})
                </h4>
                <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:space-y-0 lg:block lg:space-y-3">
                  {demo.members.map((name, i) => {
                    const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'];
                    return (
                      <div key={i} className="flex items-center gap-2.5 sm:mb-3 lg:mb-0">
                        <div className={`w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-medium shrink-0`}>
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                          <p className="text-xs text-gray-400 truncate">{name.toLowerCase().replace(' ', '')}@example.com</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-gray-200">
                <div className="flex border-b border-gray-200 px-4">
                  <button
                    onClick={() => setDemoTab('expenses')}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition ${demoTab === 'expenses'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Expenses
                  </button>
                  <button
                    onClick={() => setDemoTab('balances')}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition ${demoTab === 'balances'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Balances
                  </button>
                </div>

                <div className="p-4">
                  {demoTab === 'expenses' && (
                    <div className="space-y-3">
                      {demo.expenses.map((exp, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base shrink-0">
                              {exp.title[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{exp.title}</p>
                              <p className="text-xs text-gray-400">
                                Paid by {exp.paidBy} · {exp.date || 'Recently'}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right pl-12 sm:pl-0">
                            <p className="text-sm font-semibold text-gray-900">{exp.amount}</p>
                            <p className={`text-xs font-medium ${exp.note.includes('lent') ? 'text-emerald-500' : 'text-red-500'}`}>
                              {exp.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {demoTab === 'balances' && (
                    <div className="space-y-3">
                      {demo.balances.map((b, i) => {
                        const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'];
                        return (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                                {b.from.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {b.from === 'You' ? 'You' : b.from}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{b.from.toLowerCase()}@example.com</p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right pl-10 sm:pl-0">
                              {b.balance !== 0 && (
                                <p
                                  className={`text-sm font-semibold ${b.to === "You" ? "text-green-500" : "text-red-500"
                                    }`}
                                >
                                  {b.to === "You"
                                    ? `owes you ${b.amount}`
                                    : `owes ${b.to} ${b.amount}`}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create a group',
                desc: 'Make a group for your trip, flat, or dinner. Add people by their email address.',
              },
              {
                step: '02',
                title: 'Add expenses',
                desc: 'Log who paid and who\'s splitting it. SplitEase calculates everyone\'s share instantly.',
              },
              {
                step: '03',
                title: 'See who owes what',
                desc: 'Check the Balances tab for a clear breakdown. Mark debts settled when paid.',
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col">
                <span className="text-4xl font-black text-indigo-100 mb-4">{item.step}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Ready to try it?</h2>
          <p className="text-sm sm:text-base text-slate-500 mb-8">
            Free to use. No credit card. Built as a full-stack learning project — but actually useful.
          </p>
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition"
          >
            Create an account <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-indigo-600">SplitEase</span>
          </div>
          <p className="text-center sm:text-left">Built by <span className="text-slate-600 font-medium">Vidhi Patel</span> · MERN Stack Project</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="hover:text-slate-600 transition">Sign in</Link>
            <Link to="/register" className="hover:text-slate-600 transition">Register</Link>
            <a href="https://github.com/vidhisonani/bill-splitter" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}