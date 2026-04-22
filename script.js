/* ══════════════════════════════════════════════════════
   CHEMISTRY CALCULATOR — UMIT
   BT-101 Applied Chemistry, B.Tech Sem II
   ══════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────────
//  SYLLABUS DATA — strictly per UMIT BT-101 Sem II
// ─────────────────────────────────────────────────────
const MODULES = [
  /* ══════════════════════════════════════════════════
     MODULE I — Atomic & Molecular Structure (30%, 10 hrs)
  ══════════════════════════════════════════════════ */
  {
    id: 'atomic',
    roman: 'I',
    icon: '⚛',
    label: 'Atomic & Molecular Structure',
    desc: 'Schrödinger equation, particle in a box, hydrogen atom, molecular orbitals, crystal field theory, band structure.',
    hours: 10,
    weight: '30%',
    formulas: [
      {
        id: 'schrodinger_energy',
        name: 'Particle in a Box — Energy Levels',
        tag: 'Module I',
        desc: 'Calculates the quantised energy levels of a particle (electron) confined in a one-dimensional box, derived from the Schrödinger equation.',
        equation: 'Eₙ = n²h² / (8mL²)',
        vars: 'Eₙ = energy of nth level (J) · n = quantum number (1,2,3…) · h = Planck constant (6.626×10⁻³⁴ J·s) · m = mass of particle (kg) · L = box length (m)',
        inputs: [
          { id: 'n', label: 'Quantum Number', symbol: 'n', unit: '', placeholder: '1', min: 1 },
          { id: 'L', label: 'Box Length', symbol: 'L', unit: 'm', placeholder: '1e-9' },
          { id: 'm', label: 'Particle Mass', symbol: 'm', unit: 'kg', placeholder: '9.109e-31', hint: 'electron: 9.109e-31' },
        ],
        calculate(v) {
          const n = Math.round(+v.n), h = 6.626e-34, m = +v.m, L = +v.L;
          if (n < 1) throw new Error('Quantum number n must be ≥ 1.');
          if (m <= 0) throw new Error('Mass must be positive.');
          if (L <= 0) throw new Error('Box length must be positive.');
          const E = (n*n * h*h) / (8 * m * L*L);
          const E_eV = E / 1.602e-19;
          return {
            value: toSci(E),
            unit: 'Joules (J)',
            interp: `Energy level E${n} = ${toSci(E)} J = ${E_eV.toFixed(4)} eV.\nHigher quantum number → higher energy. Level spacing increases as n².`,
            steps: [`h = 6.626×10⁻³⁴ J·s`, `n = ${n}`, `m = ${v.m} kg`, `L = ${v.L} m`, `E = n²h²/(8mL²)`, `E = ${toSci(E)} J`]
          };
        }
      },
      {
        id: 'conjugated_box',
        name: 'Conjugated Molecules — Box Length',
        tag: 'Module I',
        desc: 'Estimates the effective box length for π-electrons in conjugated molecules (e.g. butadiene, benzene) using the particle-in-a-box model.',
        equation: 'L = (N_bonds + 1) × d_bond',
        vars: 'L = effective box length · N_bonds = number of π bonds · d_bond = average C–C bond length (1.40 Å for aromatic, 1.54 Å single)',
        inputs: [
          { id: 'Nb', label: 'Number of C–C bonds in chain', symbol: 'N', unit: '', placeholder: '3', hint: 'butadiene=3' },
          { id: 'db', label: 'Average bond length', symbol: 'd', unit: 'Å', placeholder: '1.40', hint: 'aromatic≈1.40, single≈1.54' },
        ],
        calculate(v) {
          const Nb = +v.Nb, db = +v.db;
          if (Nb < 1) throw new Error('Number of bonds must be ≥ 1.');
          if (db <= 0) throw new Error('Bond length must be positive.');
          const L_A = (Nb + 1) * db;
          const L_m = L_A * 1e-10;
          return {
            value: L_A.toFixed(3),
            unit: 'Ångströms (Å)',
            interp: `Effective box length L = ${L_A.toFixed(3)} Å = ${toSci(L_m)} m.\nUse this L in the particle-in-a-box energy formula for π-transitions.`,
            steps: [`N_bonds = ${Nb}`, `d_bond = ${db} Å`, `L = (${Nb}+1)×${db} = ${L_A.toFixed(3)} Å`]
          };
        }
      },
      {
        id: 'hydrogen_energy',
        name: 'Hydrogen Atom — Energy Levels',
        tag: 'Module I',
        desc: 'Energy of the hydrogen atom wave functions at quantum level n, from the Bohr-Schrödinger model.',
        equation: 'Eₙ = −13.6 / n²  eV',
        vars: 'Eₙ = energy (eV) · n = principal quantum number · 13.6 eV = Rydberg energy',
        inputs: [
          { id: 'n', label: 'Principal Quantum Number', symbol: 'n', unit: '', placeholder: '1', hint: '1=ground, 2,3…=excited' },
        ],
        calculate(v) {
          const n = Math.round(+v.n);
          if (n < 1) throw new Error('n must be ≥ 1.');
          const E = -13.6 / (n * n);
          const E_J = E * 1.602e-19;
          return {
            value: E.toFixed(4),
            unit: 'eV',
            interp: `E${n} = ${E.toFixed(4)} eV (${toSci(E_J)} J).\n${n === 1 ? 'Ground state.' : `Excited state. Ionisation from n=${n} requires ${Math.abs(E).toFixed(4)} eV.`}`,
            steps: [`n = ${n}`, `E = -13.6/n² = -13.6/${n*n}`, `E = ${E.toFixed(4)} eV`]
          };
        }
      },
      {
        id: 'spectral_transition',
        name: 'Hydrogen Spectral Transition',
        tag: 'Module I',
        desc: 'Wavelength of photon emitted/absorbed during transition between hydrogen energy levels (Rydberg formula).',
        equation: '1/λ = Rᴴ (1/n₁² − 1/n₂²)',
        vars: '1/λ = wavenumber · Rᴴ = Rydberg constant (1.097×10⁷ m⁻¹) · n₁ = lower level · n₂ = upper level',
        inputs: [
          { id: 'n1', label: 'Lower Level (n₁)', symbol: 'n₁', unit: '', placeholder: '1' },
          { id: 'n2', label: 'Upper Level (n₂)', symbol: 'n₂', unit: '', placeholder: '3' },
        ],
        calculate(v) {
          const n1 = Math.round(+v.n1), n2 = Math.round(+v.n2);
          if (n1 < 1 || n2 < 1) throw new Error('Quantum numbers must be ≥ 1.');
          if (n2 <= n1) throw new Error('n₂ must be greater than n₁.');
          const R = 1.097e7;
          const inv_lambda = R * (1/(n1*n1) - 1/(n2*n2));
          const lambda_m = 1 / inv_lambda;
          const lambda_nm = lambda_m * 1e9;
          let series = '';
          if (n1 === 1) series = 'Lyman series (UV)';
          else if (n1 === 2) series = 'Balmer series (visible)';
          else if (n1 === 3) series = 'Paschen series (IR)';
          else series = 'Brackett/Pfund series (IR)';
          return {
            value: lambda_nm.toFixed(2),
            unit: 'nm',
            interp: `λ = ${lambda_nm.toFixed(2)} nm — ${series}.\nWavenumber = ${inv_lambda.toFixed(0)} m⁻¹.`,
            steps: [`n₁=${n1}, n₂=${n2}`, `1/λ = R(1/${n1}²-1/${n2}²)`, `1/λ = ${inv_lambda.toFixed(2)} m⁻¹`, `λ = ${lambda_nm.toFixed(2)} nm`]
          };
        }
      },
      {
        id: 'bond_order',
        name: 'Molecular Orbital — Bond Order',
        tag: 'Module I',
        desc: 'Calculates bond order of diatomic molecules using the molecular orbital theory (bonding vs antibonding electrons).',
        equation: 'B.O. = ½ (Nb − Na)',
        vars: 'Nb = electrons in bonding MOs · Na = electrons in antibonding MOs',
        inputs: [
          { id: 'Nb', label: 'Bonding Electrons', symbol: 'Nᵦ', unit: '', placeholder: '8' },
          { id: 'Na', label: 'Antibonding Electrons', symbol: 'N*', unit: '', placeholder: '4' },
        ],
        calculate(v) {
          const Nb = +v.Nb, Na = +v.Na;
          if (Nb < 0 || Na < 0) throw new Error('Electron counts must be non-negative.');
          const BO = 0.5 * (Nb - Na);
          let stability = '';
          if (BO <= 0) stability = 'Molecule is unstable or does not exist.';
          else if (BO < 1) stability = 'Fractional bond — species exists (e.g. He₂⁺).';
          else if (BO === 1) stability = 'Single bond.';
          else if (BO === 2) stability = 'Double bond.';
          else if (BO === 3) stability = 'Triple bond — very stable (e.g. N₂).';
          else stability = 'Very high bond order.';
          return {
            value: BO.toFixed(1),
            unit: '',
            interp: `Bond Order = ${BO.toFixed(1)}. ${stability}`,
            steps: [`Nᵦ = ${Nb}, N* = ${Na}`, `B.O. = ½(${Nb}−${Na}) = ${BO.toFixed(1)}`]
          };
        }
      },
      {
        id: 'crystal_field',
        name: 'Crystal Field Splitting (Δ)',
        tag: 'Module I',
        desc: 'Calculates the Crystal Field Stabilisation Energy (CFSE) for transition metal complexes using Δₒ (octahedral splitting).',
        equation: 'CFSE = (−0.4 × t₂g − 0.6 × eᵍ) × Δₒ',
        vars: 't₂g = electrons in t₂g orbitals · eᵍ = electrons in eᵍ orbitals · Δₒ = crystal field splitting energy',
        inputs: [
          { id: 't2g', label: 't₂g electrons', symbol: 't₂g', unit: '', placeholder: '6', hint: '0–6' },
          { id: 'eg', label: 'eᵍ electrons', symbol: 'eᵍ', unit: '', placeholder: '0', hint: '0–4' },
          { id: 'delta', label: 'Δₒ value', symbol: 'Δₒ', unit: 'cm⁻¹', placeholder: '10000' },
        ],
        calculate(v) {
          const t = +v.t2g, e = +v.eg, D = +v.delta;
          if (t < 0 || t > 6) throw new Error('t₂g electrons: 0–6.');
          if (e < 0 || e > 4) throw new Error('eᵍ electrons: 0–4.');
          if (D <= 0) throw new Error('Δₒ must be positive.');
          const cfse = (-0.4 * t + 0.6 * e) * D;
          const cfse_abs = Math.abs(cfse);
          return {
            value: cfse.toFixed(1),
            unit: 'cm⁻¹',
            interp: `CFSE = ${cfse.toFixed(1)} cm⁻¹ (${cfse < 0 ? 'stabilisation' : 'destabilisation'}).\nIn kJ/mol ≈ ${(cfse * 11.96e-3).toFixed(2)} kJ/mol.`,
            steps: [`t₂g=${t}, eᵍ=${e}, Δₒ=${D} cm⁻¹`, `CFSE=(−0.4×${t}+0.6×${e})×${D}`, `CFSE=${cfse.toFixed(1)} cm⁻¹`]
          };
        }
      },
      {
        id: 'magnetic_moment',
        name: 'Magnetic Moment (Spin-only)',
        tag: 'Module I',
        desc: 'Spin-only magnetic moment of a transition metal ion — relates directly to the number of unpaired electrons.',
        equation: 'μ = √(n(n+2)) BM',
        vars: 'μ = magnetic moment in Bohr Magnetons · n = number of unpaired electrons',
        inputs: [
          { id: 'n', label: 'Unpaired Electrons', symbol: 'n', unit: '', placeholder: '5', hint: 'e.g. Fe³⁺ = 5' },
        ],
        calculate(v) {
          const n = Math.round(+v.n);
          if (n < 0) throw new Error('n must be ≥ 0.');
          const mu = Math.sqrt(n * (n + 2));
          return {
            value: mu.toFixed(4),
            unit: 'Bohr Magnetons (BM)',
            interp: `μ = ${mu.toFixed(4)} BM for ${n} unpaired electron${n!==1?'s':''}.\n${n === 0 ? 'Diamagnetic.' : 'Paramagnetic.'}`,
            steps: [`n = ${n}`, `μ = √(n(n+2)) = √(${n}×${n+2})`, `μ = √${n*(n+2)} = ${mu.toFixed(4)} BM`]
          };
        }
      },
      {
        id: 'band_gap',
        name: 'Band Gap & Conductivity',
        tag: 'Module I',
        desc: 'Classifies solids and estimates conductivity from band gap energy. Relates to semiconductor doping discussed in syllabus.',
        equation: 'σ ∝ exp(−Eg / 2kT)',
        vars: 'Eg = band gap (eV) · k = Boltzmann constant (8.617×10⁻⁵ eV/K) · T = temperature (K)',
        inputs: [
          { id: 'Eg', label: 'Band Gap Energy', symbol: 'Eᵍ', unit: 'eV', placeholder: '1.1', hint: 'Si=1.1, Ge=0.67, GaAs=1.42' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '300' },
        ],
        calculate(v) {
          const Eg = +v.Eg, T = +v.T, k = 8.617e-5;
          if (T <= 0) throw new Error('Temperature must be > 0 K.');
          if (Eg < 0) throw new Error('Band gap must be ≥ 0 eV.');
          const exponent = -Eg / (2 * k * T);
          const rel_cond = Math.exp(exponent);
          let type = '';
          if (Eg === 0) type = 'Conductor (metal).';
          else if (Eg < 3) type = 'Semiconductor.';
          else type = 'Insulator.';
          return {
            value: rel_cond.toExponential(4),
            unit: 'relative conductivity (arb. units)',
            interp: `${type}\nEg = ${Eg} eV at T = ${T} K.\nRelative σ ∝ ${rel_cond.toExponential(4)}.\nHigher T or lower Eg → higher conductivity.`,
            steps: [`Eg = ${Eg} eV`, `T = ${T} K`, `k = 8.617×10⁻⁵ eV/K`, `exp = -${Eg}/(2×${k.toFixed(5)}×${T})`, `σ ∝ ${rel_cond.toExponential(4)}`]
          };
        }
      },
    ]
  },

  /* ══════════════════════════════════════════════════
     MODULE II — Spectroscopic Techniques (25%, 6 hrs)
  ══════════════════════════════════════════════════ */
  {
    id: 'spectroscopy',
    roman: 'II',
    icon: '🔬',
    label: 'Spectroscopic Techniques',
    desc: 'Electronic, vibrational, rotational, NMR spectroscopy. Selection rules, Beer-Lambert law, MRI.',
    hours: 6,
    weight: '25%',
    formulas: [
      {
        id: 'beer_lambert',
        name: 'Beer-Lambert Law',
        tag: 'Module II',
        desc: 'Fundamental law relating the absorbance of light to the concentration and path length of the absorbing medium.',
        equation: 'A = ε · c · l = log₁₀(I₀/I)',
        vars: 'A = absorbance · ε = molar absorptivity (L/mol·cm) · c = concentration (mol/L) · l = path length (cm)',
        inputs: [
          {
            id: 'mode',
            label: 'Solve For',
            symbol: '',
            type: 'select',
            options: ['Absorbance (A)', 'Concentration (c)', 'Path Length (l)', 'Transmittance (T%)']
          },
          { id: 'eps', label: 'Molar Absorptivity (ε)', symbol: 'ε', unit: 'L/mol·cm', placeholder: '5000' },
          { id: 'c', label: 'Concentration', symbol: 'c', unit: 'mol/L', placeholder: '0.001' },
          { id: 'l', label: 'Path Length', symbol: 'l', unit: 'cm', placeholder: '1.0' },
          { id: 'A', label: 'Absorbance', symbol: 'A', unit: '', placeholder: '0.5', hint: 'needed if solving for c or l' },
        ],
        calculate(v) {
          const mode = v.mode || 'Absorbance (A)';
          const eps = +v.eps, c = +v.c, l = +v.l, A_in = +v.A;
          if (mode.includes('Absorbance')) {
            if (eps <= 0) throw new Error('ε must be positive.');
            if (c <= 0) throw new Error('Concentration must be positive.');
            if (l <= 0) throw new Error('Path length must be positive.');
            const A = eps * c * l;
            const T = Math.pow(10, -A) * 100;
            return { value: A.toFixed(4), unit: '', interp: `A = ${A.toFixed(4)}, Transmittance T = ${T.toFixed(2)}%.`, steps: [`A = ε×c×l = ${eps}×${c}×${l}`, `A = ${A.toFixed(4)}`] };
          } else if (mode.includes('Concentration')) {
            if (A_in <= 0) throw new Error('Absorbance must be positive.');
            if (eps <= 0 || l <= 0) throw new Error('ε and l must be positive.');
            const c_res = A_in / (eps * l);
            return { value: c_res.toExponential(4), unit: 'mol/L', interp: `c = A/(ε×l) = ${A_in}/(${eps}×${l}) = ${c_res.toExponential(4)} mol/L.`, steps: [`c = A/(ε·l)`, `c = ${A_in}/(${eps}×${l})`, `c = ${c_res.toExponential(4)} mol/L`] };
          } else if (mode.includes('Path Length')) {
            if (A_in <= 0) throw new Error('Absorbance must be positive.');
            if (eps <= 0 || c <= 0) throw new Error('ε and c must be positive.');
            const l_res = A_in / (eps * c);
            return { value: l_res.toFixed(4), unit: 'cm', interp: `l = A/(ε×c) = ${A_in}/(${eps}×${c}) = ${l_res.toFixed(4)} cm.`, steps: [`l = A/(ε·c)`, `l = ${l_res.toFixed(4)} cm`] };
          } else {
            if (eps <= 0 || c <= 0 || l <= 0) throw new Error('ε, c, l must be positive.');
            const A2 = eps * c * l;
            const T = Math.pow(10, -A2) * 100;
            return { value: T.toFixed(2), unit: '%', interp: `T = 10^(-A) × 100 = ${T.toFixed(2)}%. A = ${A2.toFixed(4)}.`, steps: [`A = ε×c×l = ${A2.toFixed(4)}`, `T = 10^(-A)×100 = ${T.toFixed(2)}%`] };
          }
        }
      },
      {
        id: 'vibrational_freq',
        name: 'Vibrational Frequency (Diatomic)',
        tag: 'Module II',
        desc: 'Fundamental vibrational frequency of a diatomic molecule using the harmonic oscillator model.',
        equation: 'ν̃ = (1/2πc) √(k/μ)',
        vars: 'ν̃ = wavenumber (cm⁻¹) · k = force constant (N/m) · μ = reduced mass (kg) · c = speed of light',
        inputs: [
          { id: 'k', label: 'Force Constant', symbol: 'k', unit: 'N/m', placeholder: '500', hint: 'H–Cl≈516, C–H≈500' },
          { id: 'mu', label: 'Reduced Mass', symbol: 'μ', unit: 'kg', placeholder: '1.628e-27', hint: 'H–Cl≈1.628×10⁻²⁷ kg' },
        ],
        calculate(v) {
          const k = +v.k, mu = +v.mu, c = 3e10;
          if (k <= 0) throw new Error('Force constant must be positive.');
          if (mu <= 0) throw new Error('Reduced mass must be positive.');
          const nu_hz = (1/(2*Math.PI)) * Math.sqrt(k/mu);
          const nu_cm = nu_hz / c;
          return {
            value: nu_cm.toFixed(1),
            unit: 'cm⁻¹',
            interp: `ν̃ = ${nu_cm.toFixed(1)} cm⁻¹ — this is an IR-active stretching vibration.\nFrequency ν = ${nu_hz.toExponential(3)} Hz.`,
            steps: [`k=${v.k} N/m, μ=${v.mu} kg`, `ν=(1/2π)√(k/μ) = ${nu_hz.toExponential(3)} Hz`, `ν̃ = ν/c = ${nu_cm.toFixed(1)} cm⁻¹`]
          };
        }
      },
      {
        id: 'rotational_energy',
        name: 'Rotational Energy Levels',
        tag: 'Module II',
        desc: 'Energy of rotational levels for a rigid diatomic molecule. Key for microwave/rotational spectroscopy.',
        equation: 'EJ = hcBJ(J+1)',
        vars: 'EJ = energy of level J · B = rotational constant (cm⁻¹) · J = rotational quantum number · h,c = Planck, speed of light',
        inputs: [
          { id: 'J', label: 'Rotational Quantum Number (J)', symbol: 'J', unit: '', placeholder: '1', hint: '0,1,2,…' },
          { id: 'B', label: 'Rotational Constant', symbol: 'B', unit: 'cm⁻¹', placeholder: '10.59', hint: 'HCl≈10.59, CO≈1.92' },
        ],
        calculate(v) {
          const J = Math.round(+v.J), B = +v.B;
          if (J < 0) throw new Error('J must be ≥ 0.');
          if (B <= 0) throw new Error('B must be positive.');
          const h = 6.626e-34, c = 3e10;
          const E = h * c * B * J * (J + 1);
          const E_eV = E / 1.602e-19;
          const dE = h * c * B * 2 * (J + 1);
          const dE_cm = 2 * B * (J + 1);
          return {
            value: toSci(E),
            unit: 'J',
            interp: `EJ = ${toSci(E)} J = ${E_eV.toExponential(4)} eV.\nTransition J→J+1: ΔE = 2B(J+1) = ${dE_cm.toFixed(3)} cm⁻¹.`,
            steps: [`J=${J}, B=${B} cm⁻¹`, `EJ=hcB×J(J+1)=hcB×${J*(J+1)}`, `EJ=${toSci(E)} J`]
          };
        }
      },
      {
        id: 'electronic_transition',
        name: 'Electronic Spectroscopy — λmax',
        tag: 'Module II',
        desc: 'Wavelength of maximum absorption for electronic transition. Used in UV-Vis spectroscopy.',
        equation: 'λ = hc / ΔE',
        vars: 'λ = wavelength (nm) · h = 6.626×10⁻³⁴ J·s · c = 3×10⁸ m/s · ΔE = energy gap (eV)',
        inputs: [
          { id: 'dE', label: 'Energy Gap ΔE', symbol: 'ΔE', unit: 'eV', placeholder: '3.5' },
        ],
        calculate(v) {
          const dE_eV = +v.dE;
          if (dE_eV <= 0) throw new Error('Energy gap must be positive.');
          const dE_J = dE_eV * 1.602e-19;
          const lambda_m = (6.626e-34 * 3e8) / dE_J;
          const lambda_nm = lambda_m * 1e9;
          let region = '';
          if (lambda_nm < 200) region = 'Vacuum UV';
          else if (lambda_nm < 400) region = 'UV';
          else if (lambda_nm < 700) region = 'Visible';
          else if (lambda_nm < 2500) region = 'Near IR';
          else region = 'IR';
          return {
            value: lambda_nm.toFixed(2),
            unit: 'nm',
            interp: `λmax = ${lambda_nm.toFixed(2)} nm — ${region} region.\nFor ΔE = ${dE_eV} eV.`,
            steps: [`ΔE = ${dE_eV} eV = ${dE_J.toExponential(3)} J`, `λ = hc/ΔE`, `λ = ${lambda_nm.toFixed(2)} nm`]
          };
        }
      },
      {
        id: 'nmr_shielding',
        name: 'NMR — Chemical Shift',
        tag: 'Module II',
        desc: 'Chemical shift (δ) in NMR spectroscopy. Relates resonance frequency of a nucleus relative to a reference.',
        equation: 'δ = (νsample − νref) / νref × 10⁶  ppm',
        vars: 'δ = chemical shift (ppm) · νsample = resonance frequency of sample (Hz) · νref = reference frequency (Hz)',
        inputs: [
          { id: 'nu_s', label: 'Sample Frequency (νₛ)', symbol: 'νₛ', unit: 'Hz', placeholder: '400100000' },
          { id: 'nu_r', label: 'Reference Frequency (νᵣ)', symbol: 'νᵣ', unit: 'Hz', placeholder: '400000000', hint: 'TMS reference' },
        ],
        calculate(v) {
          const nu_s = +v.nu_s, nu_r = +v.nu_r;
          if (nu_r <= 0) throw new Error('Reference frequency must be positive.');
          const delta = ((nu_s - nu_r) / nu_r) * 1e6;
          let env = '';
          if (Math.abs(delta) < 1) env = 'Highly shielded (TMS-like).';
          else if (delta < 3) env = 'Alkyl / aliphatic region.';
          else if (delta < 6) env = 'Allylic / N-H / O-H region.';
          else if (delta < 9) env = 'Aromatic / alkene region.';
          else env = 'Aldehyde / carboxylic acid region.';
          return {
            value: delta.toFixed(3),
            unit: 'ppm',
            interp: `δ = ${delta.toFixed(3)} ppm. ${env}`,
            steps: [`νₛ=${nu_s} Hz, νᵣ=${nu_r} Hz`, `δ=(νₛ-νᵣ)/νᵣ×10⁶`, `δ=${delta.toFixed(3)} ppm`]
          };
        }
      },
      {
        id: 'larmor',
        name: 'Larmor Frequency (NMR / MRI)',
        tag: 'Module II',
        desc: 'Larmor precession frequency of a nucleus in a magnetic field — fundamental to NMR and MRI.',
        equation: 'ν₀ = γ B₀ / 2π',
        vars: 'ν₀ = Larmor frequency (Hz) · γ = gyromagnetic ratio (rad/T·s) · B₀ = magnetic field (T)',
        inputs: [
          { id: 'gamma', label: 'Gyromagnetic Ratio (γ)', symbol: 'γ', unit: 'MHz/T', placeholder: '42.58', hint: '¹H=42.58, ¹³C=10.71' },
          { id: 'B0', label: 'Magnetic Field (B₀)', symbol: 'B₀', unit: 'T', placeholder: '1.5', hint: 'MRI: 1.5 T or 3 T' },
        ],
        calculate(v) {
          const gamma = +v.gamma, B0 = +v.B0;
          if (gamma <= 0) throw new Error('γ must be positive.');
          if (B0 <= 0) throw new Error('B₀ must be positive.');
          const nu0 = gamma * B0;
          return {
            value: nu0.toFixed(2),
            unit: 'MHz',
            interp: `ν₀ = ${nu0.toFixed(2)} MHz at B₀ = ${B0} T.\n${B0 >= 1 ? `This is in the range of clinical MRI scanners.` : ''}`,
            steps: [`ν₀ = γ×B₀`, `ν₀ = ${gamma}×${B0} = ${nu0.toFixed(2)} MHz`]
          };
        }
      },
    ]
  },

  /* ══════════════════════════════════════════════════
     MODULE III — Intermolecular Forces (15%, 4 hrs)
  ══════════════════════════════════════════════════ */
  {
    id: 'intermolecular',
    roman: 'III',
    icon: '🧲',
    label: 'Intermolecular Forces',
    desc: 'Ionic, dipolar, van der Waals interactions. Equations of state, critical phenomena, potential energy surfaces.',
    hours: 4,
    weight: '15%',
    formulas: [
      {
        id: 'van_der_waals',
        name: "Van der Waals Equation of State",
        tag: 'Module III',
        desc: 'Corrected equation of state for real gases accounting for intermolecular attractions and finite molecular volume.',
        equation: '(P + a/V²)(V − b) = RT',
        vars: 'P = pressure (atm) · V = molar volume (L/mol) · a = attraction constant · b = excluded volume · T = temp (K)',
        inputs: [
          {
            id: 'solve',
            label: 'Solve For',
            symbol: '',
            type: 'select',
            options: ['Pressure (P)', 'Temperature (T)']
          },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '300' },
          { id: 'V', label: 'Molar Volume', symbol: 'V', unit: 'L/mol', placeholder: '1.0' },
          { id: 'a', label: 'Van der Waals a', symbol: 'a', unit: 'L²·atm/mol²', placeholder: '3.640', hint: 'CO₂=3.640, N₂=1.390' },
          { id: 'b', label: 'Van der Waals b', symbol: 'b', unit: 'L/mol', placeholder: '0.04267', hint: 'CO₂=0.04267, N₂=0.03913' },
        ],
        calculate(v) {
          const R = 0.08206, T = +v.T, V = +v.V, a = +v.a, b = +v.b;
          const mode = v.solve || 'Pressure (P)';
          if (V <= b) throw new Error('Molar volume V must be greater than b.');
          if (T <= 0 || V <= 0 || a < 0 || b <= 0) throw new Error('Check input values (all must be positive; V > b).');
          if (mode.includes('Pressure')) {
            const P = (R * T) / (V - b) - a / (V * V);
            const P_ideal = R * T / V;
            return {
              value: P.toFixed(4),
              unit: 'atm',
              interp: `P_real = ${P.toFixed(4)} atm. P_ideal = ${P_ideal.toFixed(4)} atm.\nDeviation = ${((P - P_ideal)/P_ideal*100).toFixed(2)}%.`,
              steps: [`P = RT/(V-b) - a/V²`, `= ${(R*T/(V-b)).toFixed(4)} - ${(a/(V*V)).toFixed(4)}`, `= ${P.toFixed(4)} atm`]
            };
          } else {
            const T_res = (P_calc => (P_calc + a/(V*V)) * (V - b) / R)(0);
            const T_from_vdw = ((0 + a/(V*V)) * (V - b)) / R;
            return {
              value: T_from_vdw.toFixed(2),
              unit: 'K',
              interp: `T derived from VdW at P=0 approximation = ${T_from_vdw.toFixed(2)} K. Use P solver for full calculation.`,
              steps: [`T = (P+a/V²)(V-b)/R`]
            };
          }
        }
      },
      {
        id: 'critical_constants',
        name: 'Critical Constants',
        tag: 'Module III',
        desc: 'Critical temperature, pressure and volume from van der Waals constants.',
        equation: 'Tc = 8a/27Rb  Pc = a/27b²  Vc = 3b',
        vars: 'a = VdW attraction constant · b = VdW excluded volume · R = 0.08206 L·atm/mol·K',
        inputs: [
          { id: 'a', label: 'Van der Waals a', symbol: 'a', unit: 'L²·atm/mol²', placeholder: '3.640', hint: 'CO₂=3.640' },
          { id: 'b', label: 'Van der Waals b', symbol: 'b', unit: 'L/mol', placeholder: '0.04267', hint: 'CO₂=0.04267' },
        ],
        calculate(v) {
          const a = +v.a, b = +v.b, R = 0.08206;
          if (a <= 0 || b <= 0) throw new Error('a and b must be positive.');
          const Tc = 8*a / (27*R*b);
          const Pc = a / (27*b*b);
          const Vc = 3*b;
          return {
            value: Tc.toFixed(2),
            unit: 'K (Tc)',
            interp: `Critical Constants:\nTc = ${Tc.toFixed(2)} K (${(Tc-273.15).toFixed(2)} °C)\nPc = ${Pc.toFixed(4)} atm\nVc = ${Vc.toFixed(5)} L/mol`,
            steps: [`Tc=8a/(27Rb)=${Tc.toFixed(2)} K`, `Pc=a/27b²=${Pc.toFixed(4)} atm`, `Vc=3b=${Vc.toFixed(5)} L/mol`]
          };
        }
      },
      {
        id: 'coulomb_energy',
        name: 'Ionic Interaction Energy',
        tag: 'Module III',
        desc: 'Coulomb potential energy between two ions (ionic interaction). Fundamental to ionic solid stability and lattice energy.',
        equation: 'V = q₁q₂e² / (4πε₀r)',
        vars: 'q₁,q₂ = ionic charges · e = 1.602×10⁻¹⁹ C · ε₀ = 8.854×10⁻¹² C²/J·m · r = interionic distance (m)',
        inputs: [
          { id: 'q1', label: 'Charge of ion 1 (q₁)', symbol: 'q₁', unit: 'e', placeholder: '1', hint: 'Na⁺=+1, Ca²⁺=+2' },
          { id: 'q2', label: 'Charge of ion 2 (q₂)', symbol: 'q₂', unit: 'e', placeholder: '-1', hint: 'Cl⁻=-1, O²⁻=-2' },
          { id: 'r', label: 'Interionic distance', symbol: 'r', unit: 'Å', placeholder: '2.36', hint: 'NaCl≈2.36 Å' },
        ],
        calculate(v) {
          const q1 = +v.q1, q2 = +v.q2, r_A = +v.r;
          if (r_A <= 0) throw new Error('Distance must be positive.');
          const r = r_A * 1e-10;
          const e = 1.602e-19, eps0 = 8.854e-12;
          const V = (q1 * q2 * e * e) / (4 * Math.PI * eps0 * r);
          const V_kJ = V * 6.022e23 / 1000;
          return {
            value: V_kJ.toFixed(2),
            unit: 'kJ/mol',
            interp: `V = ${V_kJ.toFixed(2)} kJ/mol.\n${V < 0 ? 'Attractive (opposite charges) — stabilising.' : 'Repulsive (like charges) — destabilising.'}`,
            steps: [`q₁=${q1}, q₂=${q2}, r=${r_A} Å = ${toSci(r)} m`, `V=(q₁q₂e²)/(4πε₀r)`, `V=${V_kJ.toFixed(2)} kJ/mol`]
          };
        }
      },
      {
        id: 'dipole_energy',
        name: 'Dipole–Dipole Interaction',
        tag: 'Module III',
        desc: 'Average interaction energy between two polar molecules (Keesom energy) as a function of dipole moments and distance.',
        equation: 'V = −2μ₁²μ₂² / (3kT(4πε₀)²r⁶)',
        vars: 'μ = dipole moment (Debye) · T = temperature (K) · r = distance (Å)',
        inputs: [
          { id: 'mu1', label: 'Dipole Moment μ₁', symbol: 'μ₁', unit: 'D', placeholder: '1.85', hint: 'H₂O≈1.85 D' },
          { id: 'mu2', label: 'Dipole Moment μ₂', symbol: 'μ₂', unit: 'D', placeholder: '1.85' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '298' },
          { id: 'r', label: 'Distance', symbol: 'r', unit: 'Å', placeholder: '3.5' },
        ],
        calculate(v) {
          const mu1_D = +v.mu1, mu2_D = +v.mu2, T = +v.T, r_A = +v.r;
          if (T <= 0) throw new Error('Temperature must be positive.');
          if (r_A <= 0) throw new Error('Distance must be positive.');
          const D_to_Cm = 3.336e-30;
          const mu1 = mu1_D * D_to_Cm, mu2 = mu2_D * D_to_Cm;
          const r = r_A * 1e-10, k = 1.38e-23, eps0 = 8.854e-12;
          const V = -2*mu1*mu1*mu2*mu2 / (3*k*T*(4*Math.PI*eps0)**2*r**6);
          const V_kJmol = V * 6.022e23 / 1000;
          return {
            value: V_kJmol.toExponential(3),
            unit: 'kJ/mol',
            interp: `Keesom dipole–dipole energy = ${V_kJmol.toExponential(3)} kJ/mol.\nTypically −0.1 to −10 kJ/mol for polar molecules.`,
            steps: [`μ₁=${mu1_D} D, μ₂=${mu2_D} D, T=${T} K, r=${r_A} Å`, `V=${V_kJmol.toExponential(3)} kJ/mol`]
          };
        }
      },
      {
        id: 'lennard_jones',
        name: 'Lennard-Jones Potential',
        tag: 'Module III',
        desc: 'Lennard-Jones 12-6 pair potential — models van der Waals interactions including repulsion and attraction.',
        equation: 'V(r) = 4ε [(σ/r)¹² − (σ/r)⁶]',
        vars: 'ε = well depth (J) · σ = collision diameter (Å) · r = separation (Å)',
        inputs: [
          { id: 'eps_kJ', label: 'Well Depth ε', symbol: 'ε', unit: 'kJ/mol', placeholder: '0.996', hint: 'Ar≈0.996, Ne≈0.284' },
          { id: 'sigma', label: 'Collision Diameter σ', symbol: 'σ', unit: 'Å', placeholder: '3.40', hint: 'Ar≈3.40 Å' },
          { id: 'r', label: 'Separation r', symbol: 'r', unit: 'Å', placeholder: '3.80' },
        ],
        calculate(v) {
          const eps = +v.eps_kJ, sigma = +v.sigma, r = +v.r;
          if (eps <= 0) throw new Error('ε must be positive.');
          if (sigma <= 0 || r <= 0) throw new Error('σ and r must be positive.');
          const sr = sigma / r;
          const V = 4 * eps * (Math.pow(sr, 12) - Math.pow(sr, 6));
          const r_min = sigma * Math.pow(2, 1/6);
          return {
            value: V.toFixed(4),
            unit: 'kJ/mol',
            interp: `V(r) = ${V.toFixed(4)} kJ/mol at r = ${r} Å.\n${V < 0 ? 'Attractive region (V < 0).' : 'Repulsive region (V > 0).'}\nEquilibrium separation rₘᵢₙ = ${r_min.toFixed(3)} Å.`,
            steps: [`σ/r = ${sigma}/${r} = ${sr.toFixed(4)}`, `V = 4ε[(σ/r)¹²−(σ/r)⁶]`, `V = ${V.toFixed(4)} kJ/mol`]
          };
        }
      },
      {
        id: 'compressibility',
        name: 'Compressibility Factor Z',
        tag: 'Module III',
        desc: 'Measures deviation of a real gas from ideal behaviour. Z = 1 for ideal gas.',
        equation: 'Z = PV / nRT',
        vars: 'Z = compressibility factor · P = pressure (atm) · V = volume (L) · n = moles · T = temperature (K)',
        inputs: [
          { id: 'P', label: 'Pressure', symbol: 'P', unit: 'atm', placeholder: '10' },
          { id: 'V', label: 'Volume', symbol: 'V', unit: 'L', placeholder: '2.0' },
          { id: 'n', label: 'Moles of Gas', symbol: 'n', unit: 'mol', placeholder: '1.0' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '300' },
        ],
        calculate(v) {
          const P = +v.P, V = +v.V, n = +v.n, T = +v.T, R = 0.08206;
          if (P <= 0 || V <= 0 || n <= 0 || T <= 0) throw new Error('All values must be positive.');
          const Z = (P * V) / (n * R * T);
          let behaviour = '';
          if (Math.abs(Z - 1) < 0.02) behaviour = 'Nearly ideal gas behaviour.';
          else if (Z > 1) behaviour = 'Z > 1: Repulsive forces dominate (high P).';
          else behaviour = 'Z < 1: Attractive forces dominate (moderate P).';
          return {
            value: Z.toFixed(4),
            unit: '',
            interp: `Z = ${Z.toFixed(4)}. ${behaviour}`,
            steps: [`Z = PV/(nRT)`, `Z = (${P}×${V})/(${n}×${R}×${T})`, `Z = ${Z.toFixed(4)}`]
          };
        }
      },
    ]
  },

  /* ══════════════════════════════════════════════════
     MODULE IV — Free Energy & Chemical Equilibria (30%, 10 hrs)
  ══════════════════════════════════════════════════ */
  {
    id: 'freeenergy',
    roman: 'IV',
    icon: '⚖',
    label: 'Free Energy & Equilibria',
    desc: 'Thermodynamic functions, free energy, EMF, Nernst equation, acid-base, solubility, corrosion, Ellingham diagrams.',
    hours: 10,
    weight: '30%',
    formulas: [
      {
        id: 'gibbs',
        name: 'Gibbs Free Energy',
        tag: 'Module IV',
        desc: 'Predicts spontaneity of a chemical reaction. Combines enthalpy and entropy at constant temperature.',
        equation: 'ΔG = ΔH − T·ΔS',
        vars: 'ΔG = Gibbs free energy change · ΔH = enthalpy change · T = temperature (K) · ΔS = entropy change',
        inputs: [
          { id: 'dH', label: 'Enthalpy Change ΔH', symbol: 'ΔH', unit: 'kJ/mol', placeholder: '-92.4', hint: 'negative=exothermic' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '298' },
          { id: 'dS', label: 'Entropy Change ΔS', symbol: 'ΔS', unit: 'J/mol·K', placeholder: '-198.3' },
        ],
        calculate(v) {
          const dH = +v.dH, T = +v.T, dS_J = +v.dS;
          if (T <= 0) throw new Error('Temperature must be positive.');
          const dS = dS_J / 1000;
          const dG = dH - T * dS;
          let spont = '';
          if (dG < 0) spont = 'ΔG < 0: Spontaneous reaction (product-favoured).';
          else if (dG > 0) spont = 'ΔG > 0: Non-spontaneous (requires energy input).';
          else spont = 'ΔG = 0: System at equilibrium.';
          return {
            value: dG.toFixed(3),
            unit: 'kJ/mol',
            interp: spont + `\nΔH = ${dH} kJ/mol, TΔS = ${(T*dS).toFixed(3)} kJ/mol.`,
            steps: [`ΔG = ΔH − TΔS`, `ΔG = ${dH} − ${T}×${(dS_J/1000).toFixed(4)}`, `ΔG = ${dG.toFixed(3)} kJ/mol`]
          };
        }
      },
      {
        id: 'gibbs_equilibrium',
        name: 'ΔG° and Equilibrium Constant',
        tag: 'Module IV',
        desc: 'Relates standard Gibbs free energy to the equilibrium constant of a reaction.',
        equation: 'ΔG° = −RT ln K',
        vars: 'ΔG° = standard Gibbs energy · R = 8.314 J/mol·K · T = temperature (K) · K = equilibrium constant',
        inputs: [
          {
            id: 'mode',
            label: 'Solve For',
            symbol: '',
            type: 'select',
            options: ['ΔG° from K', 'K from ΔG°']
          },
          { id: 'K', label: 'Equilibrium Constant K', symbol: 'K', unit: '', placeholder: '977' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '298' },
          { id: 'dG0', label: 'Standard ΔG°', symbol: 'ΔG°', unit: 'kJ/mol', placeholder: '-17.2', hint: 'needed if solving K' },
        ],
        calculate(v) {
          const R = 8.314e-3, T = +v.T, K = +v.K, dG0_in = +v.dG0;
          const mode = v.mode || 'ΔG° from K';
          if (T <= 0) throw new Error('Temperature must be positive.');
          if (mode.includes('ΔG°')) {
            if (K <= 0) throw new Error('K must be positive.');
            const dG0 = -R * T * Math.log(K);
            return {
              value: dG0.toFixed(3), unit: 'kJ/mol',
              interp: `ΔG° = ${dG0.toFixed(3)} kJ/mol. ${K > 1 ? 'K>1: Products favoured at equilibrium.' : 'K<1: Reactants favoured.'}`,
              steps: [`ΔG°=-RT·lnK = -${R}×${T}×ln(${K})`, `ΔG°=${dG0.toFixed(3)} kJ/mol`]
            };
          } else {
            const K_res = Math.exp(-dG0_in / (R * T));
            return {
              value: K_res.toExponential(4), unit: '',
              interp: `K = ${K_res.toExponential(4)}. ${K_res > 1 ? 'Products favoured.' : 'Reactants favoured.'}`,
              steps: [`K=exp(-ΔG°/RT)=exp(-${dG0_in}/${(R*T).toFixed(3)})`, `K=${K_res.toExponential(4)}`]
            };
          }
        }
      },
      {
        id: 'entropy_clausius',
        name: 'Entropy Change (Clausius)',
        tag: 'Module IV',
        desc: 'Entropy change for a reversible process at constant temperature. ΔS = Qrev / T.',
        equation: 'ΔS = Qrev / T',
        vars: 'ΔS = entropy change (J/K) · Qrev = reversible heat (J) · T = temperature (K)',
        inputs: [
          { id: 'Q', label: 'Reversible Heat (Qrev)', symbol: 'Q', unit: 'J', placeholder: '6020', hint: 'e.g. 6020 J = heat of fusion of ice' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '273.15', hint: '273.15 K = 0°C' },
        ],
        calculate(v) {
          const Q = +v.Q, T = +v.T;
          if (T <= 0) throw new Error('Temperature must be > 0 K.');
          const dS = Q / T;
          return {
            value: dS.toFixed(4), unit: 'J/K',
            interp: `ΔS = ${dS.toFixed(4)} J/K per mole.\n${Q > 0 ? 'Heat absorbed → entropy increases (endothermic).' : 'Heat released → entropy decreases (exothermic).'}`,
            steps: [`ΔS = Q/T = ${Q}/${T}`, `ΔS = ${dS.toFixed(4)} J/K`]
          };
        }
      },
      {
        id: 'cell_potential',
        name: 'Standard Cell Potential',
        tag: 'Module IV',
        desc: 'EMF of an electrochemical cell from standard reduction potentials. Used with Nernst equation in Module IV.',
        equation: 'E°cell = E°cathode − E°anode',
        vars: 'E°cell = standard cell EMF (V) · E°cathode = reduction potential of cathode · E°anode = reduction potential of anode',
        inputs: [
          { id: 'E_cat', label: 'Cathode E° (reduction)', symbol: 'E°c', unit: 'V', placeholder: '0.34', hint: 'Cu²⁺/Cu=+0.34 V' },
          { id: 'E_ano', label: 'Anode E° (reduction)', symbol: 'E°a', unit: 'V', placeholder: '-0.76', hint: 'Zn²⁺/Zn=−0.76 V' },
        ],
        calculate(v) {
          const Ec = +v.E_cat, Ea = +v.E_ano;
          const E = Ec - Ea;
          const spont = E > 0 ? 'Spontaneous cell (galvanic).' : 'Non-spontaneous (electrolytic cell needed).';
          return {
            value: E.toFixed(4), unit: 'V',
            interp: `E°cell = ${E.toFixed(4)} V. ${spont}`,
            steps: [`E°cell = E°cathode − E°anode`, `= ${Ec} − (${Ea})`, `= ${E.toFixed(4)} V`]
          };
        }
      },
      {
        id: 'nernst',
        name: 'Nernst Equation',
        tag: 'Module IV',
        desc: 'Cell potential at non-standard conditions. Fundamental to free energy applications in electrochemistry.',
        equation: 'E = E° − (RT/nF) ln Q',
        vars: 'E = cell potential · E° = standard potential · R = 8.314 J/mol·K · n = electrons · F = 96485 C/mol · Q = reaction quotient',
        inputs: [
          { id: 'E0', label: 'Standard Potential E°', symbol: 'E°', unit: 'V', placeholder: '1.10' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '298.15' },
          { id: 'n', label: 'Electrons Transferred', symbol: 'n', unit: 'mol e⁻', placeholder: '2' },
          { id: 'Q', label: 'Reaction Quotient Q', symbol: 'Q', unit: '', placeholder: '0.01', hint: 'Q=1 for standard; Q<1 increases E' },
        ],
        calculate(v) {
          const E0 = +v.E0, T = +v.T, n = +v.n, Q = +v.Q;
          const R = 8.314, F = 96485;
          if (n <= 0) throw new Error('n must be positive.');
          if (Q <= 0) throw new Error('Q must be positive.');
          if (T <= 0) throw new Error('T must be positive.');
          const E = E0 - (R * T) / (n * F) * Math.log(Q);
          const dG = -n * F * E / 1000;
          const spont = E > 0 ? 'Spontaneous.' : 'Non-spontaneous.';
          return {
            value: E.toFixed(4), unit: 'V',
            interp: `E = ${E.toFixed(4)} V. ${spont}\nΔG = −nFE = ${dG.toFixed(3)} kJ/mol.`,
            steps: [`RT/nF = ${(R*T/(n*F)).toFixed(5)}`, `E = ${E0} − ${(R*T/(n*F)).toFixed(5)}×ln(${Q})`, `E = ${E.toFixed(4)} V`]
          };
        }
      },
      {
        id: 'gibbs_to_emf',
        name: 'ΔG° ↔ EMF & Equilibrium',
        tag: 'Module IV',
        desc: 'Converts between standard Gibbs free energy, standard EMF, and equilibrium constant. All three are related.',
        equation: 'ΔG° = −nFE° = −RT ln K',
        vars: 'n = moles of electrons · F = 96485 C/mol · E° = standard EMF · R = 8.314 J/mol·K · T = temperature',
        inputs: [
          {
            id: 'mode',
            label: 'Given',
            symbol: '',
            type: 'select',
            options: ['E° → ΔG° and K', 'ΔG° → E° and K', 'K → ΔG° and E°']
          },
          { id: 'E0', label: 'Standard EMF E°', symbol: 'E°', unit: 'V', placeholder: '1.10' },
          { id: 'dG0', label: 'Standard ΔG°', symbol: 'ΔG°', unit: 'kJ/mol', placeholder: '-212.3' },
          { id: 'K', label: 'Equilibrium Constant K', symbol: 'K', unit: '', placeholder: '1e37' },
          { id: 'n', label: 'Electrons Transferred n', symbol: 'n', unit: '', placeholder: '2' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '298.15' },
        ],
        calculate(v) {
          const mode = v.mode || 'E° → ΔG° and K';
          const n = +v.n, T = +v.T, F = 96485, R = 8.314;
          if (n <= 0) throw new Error('n must be positive.');
          if (T <= 0) throw new Error('T must be positive.');
          if (mode.includes('E°')) {
            const E0 = +v.E0;
            const dG0 = -n * F * E0 / 1000;
            const K = Math.exp(-dG0 * 1000 / (R * T));
            return { value: dG0.toFixed(3), unit: 'kJ/mol', interp: `ΔG° = ${dG0.toFixed(3)} kJ/mol\nK = ${K.toExponential(4)}`, steps: [`ΔG°=-nFE°=-${n}×96485×${E0}/1000`, `K=exp(-ΔG°/RT)`] };
          } else if (mode.includes('ΔG°')) {
            const dG0 = +v.dG0 * 1000;
            const E0 = -dG0 / (n * F);
            const K = Math.exp(-dG0 / (R * T));
            return { value: E0.toFixed(4), unit: 'V', interp: `E° = ${E0.toFixed(4)} V\nK = ${K.toExponential(4)}`, steps: [`E°=-ΔG°/(nF)`, `K=exp(-ΔG°/RT)`] };
          } else {
            const K = +v.K;
            if (K <= 0) throw new Error('K must be positive.');
            const dG0 = -R * T * Math.log(K) / 1000;
            const E0 = -dG0 * 1000 / (n * F);
            return { value: dG0.toFixed(3), unit: 'kJ/mol', interp: `ΔG° = ${dG0.toFixed(3)} kJ/mol\nE° = ${E0.toFixed(4)} V`, steps: [`ΔG°=-RT lnK`, `E°=RT lnK/(nF)`] };
          }
        }
      },
      {
        id: 'ph_strong',
        name: 'pH — Strong Acid / Base',
        tag: 'Module IV',
        desc: 'Direct pH calculation for strong acids/bases that fully dissociate in water.',
        equation: 'pH = −log[H⁺]',
        vars: '[H⁺] = molar concentration of H⁺ · pH + pOH = 14 at 25°C',
        inputs: [
          {
            id: 'type',
            label: 'Type',
            symbol: '',
            type: 'select',
            options: ['Strong Acid — find pH', 'Strong Base — find pH']
          },
          { id: 'conc', label: 'Concentration', symbol: 'C', unit: 'mol/L', placeholder: '0.01' },
        ],
        calculate(v) {
          const type = v.type || 'Strong Acid — find pH';
          const C = +v.conc;
          if (C <= 0) throw new Error('Concentration must be positive.');
          let pH;
          if (type.includes('Acid')) {
            pH = -Math.log10(C);
          } else {
            const pOH = -Math.log10(C);
            pH = 14 - pOH;
          }
          const pOH = 14 - pH;
          const nature = pH < 7 ? 'Acidic' : pH > 7 ? 'Basic (Alkaline)' : 'Neutral';
          return {
            value: pH.toFixed(4), unit: 'pH units',
            interp: `pH = ${pH.toFixed(4)}, pOH = ${pOH.toFixed(4)} — ${nature}.`,
            steps: [type.includes('Acid') ? `pH=-log[H⁺]=-log(${C})` : `pOH=-log[OH⁻]=-log(${C}); pH=14-pOH`, `pH=${pH.toFixed(4)}`]
          };
        }
      },
      {
        id: 'ph_weak_acid',
        name: 'pH — Weak Acid',
        tag: 'Module IV',
        desc: 'pH of a weak acid using Ka. Assumes Ka << C (valid when C/Ka > 100).',
        equation: '[H⁺] = √(Ka × C)  →  pH = ½(pKa − log C)',
        vars: 'Ka = acid dissociation constant · C = initial concentration of weak acid',
        inputs: [
          { id: 'Ka', label: 'Ka (acid dissociation constant)', symbol: 'Ka', unit: '', placeholder: '1.8e-5', hint: 'CH₃COOH=1.8×10⁻⁵' },
          { id: 'C', label: 'Initial Concentration', symbol: 'C', unit: 'mol/L', placeholder: '0.1' },
        ],
        calculate(v) {
          const Ka = +v.Ka, C = +v.C;
          if (Ka <= 0) throw new Error('Ka must be positive.');
          if (C <= 0) throw new Error('Concentration must be positive.');
          const H = Math.sqrt(Ka * C);
          const pH = -Math.log10(H);
          const pct = (H / C) * 100;
          return {
            value: pH.toFixed(4), unit: 'pH units',
            interp: `[H⁺] = ${H.toExponential(4)} mol/L\npH = ${pH.toFixed(4)}\nDegree of ionisation = ${pct.toFixed(2)}%.`,
            steps: [`[H⁺]=√(Ka×C)=√(${Ka}×${C})`, `[H⁺]=${H.toExponential(4)} mol/L`, `pH=${pH.toFixed(4)}`]
          };
        }
      },
      {
        id: 'henderson',
        name: 'Henderson–Hasselbalch (Buffer)',
        tag: 'Module IV',
        desc: 'pH of a buffer solution. Acid-base equilibria from the syllabus.',
        equation: 'pH = pKa + log([A⁻]/[HA])',
        vars: 'pKa = −log Ka · [A⁻] = conjugate base concentration · [HA] = weak acid concentration',
        inputs: [
          { id: 'Ka', label: 'Ka', symbol: 'Ka', unit: '', placeholder: '1.8e-5', hint: 'CH₃COOH=1.8×10⁻⁵' },
          { id: 'A', label: 'Conjugate Base [A⁻]', symbol: '[A⁻]', unit: 'mol/L', placeholder: '0.1' },
          { id: 'HA', label: 'Weak Acid [HA]', symbol: '[HA]', unit: 'mol/L', placeholder: '0.1' },
        ],
        calculate(v) {
          const Ka = +v.Ka, A = +v.A, HA = +v.HA;
          if (Ka <= 0) throw new Error('Ka must be positive.');
          if (A <= 0 || HA <= 0) throw new Error('[A⁻] and [HA] must be positive.');
          const pKa = -Math.log10(Ka);
          const pH = pKa + Math.log10(A / HA);
          return {
            value: pH.toFixed(4), unit: 'pH units',
            interp: `pKa = ${pKa.toFixed(4)}\n[A⁻]/[HA] = ${(A/HA).toFixed(4)}\npH = ${pH.toFixed(4)}\nBuffer range: ${(pKa-1).toFixed(2)}–${(pKa+1).toFixed(2)}`,
            steps: [`pKa = -log(${Ka}) = ${pKa.toFixed(4)}`, `log([A⁻]/[HA]) = log(${(A/HA).toFixed(4)}) = ${Math.log10(A/HA).toFixed(4)}`, `pH = ${pH.toFixed(4)}`]
          };
        }
      },
      {
        id: 'solubility_ksp',
        name: 'Solubility Product (Ksp)',
        tag: 'Module IV',
        desc: 'Molar solubility from Ksp or Ksp from solubility. Covers solubility equilibria from the syllabus.',
        equation: 'Ksp = [Mⁿ⁺]ᵐ [Xᵐ⁻]ⁿ  (for MₘXₙ)',
        vars: 'Ksp = solubility product · s = molar solubility · m,n = stoichiometric coefficients',
        inputs: [
          {
            id: 'mode',
            label: 'Solve For',
            symbol: '',
            type: 'select',
            options: ['Solubility s from Ksp', 'Ksp from solubility s']
          },
          { id: 'Ksp', label: 'Ksp', symbol: 'Ksp', unit: '', placeholder: '1.8e-10', hint: 'AgCl=1.8×10⁻¹⁰' },
          { id: 's', label: 'Molar Solubility s', symbol: 's', unit: 'mol/L', placeholder: '1.34e-5', hint: 'needed if solving Ksp' },
          { id: 'm', label: 'Stoichiometry m (cation coeff.)', symbol: 'm', unit: '', placeholder: '1', hint: 'AgCl: m=1, CaF₂: m=1' },
          { id: 'n', label: 'Stoichiometry n (anion coeff.)', symbol: 'n', unit: '', placeholder: '1', hint: 'AgCl: n=1, CaF₂: n=2' },
        ],
        calculate(v) {
          const mode = v.mode || 'Solubility s from Ksp';
          const Ksp = +v.Ksp, s_in = +v.s;
          const m = Math.round(+v.m), n = Math.round(+v.n);
          if (m < 1 || n < 1) throw new Error('m and n must be ≥ 1.');
          if (mode.includes('from Ksp')) {
            if (Ksp <= 0) throw new Error('Ksp must be positive.');
            // Ksp = (ms)^m × (ns)^n = m^m × n^n × s^(m+n)
            const coeff = Math.pow(m, m) * Math.pow(n, n);
            const s = Math.pow(Ksp / coeff, 1/(m + n));
            return {
              value: s.toExponential(4), unit: 'mol/L',
              interp: `Molar solubility s = ${s.toExponential(4)} mol/L.\nIn g/L multiply by molar mass.`,
              steps: [`Ksp = m^m·n^n·s^(m+n)`, `s = (Ksp/${coeff})^(1/${m+n})`, `s = ${s.toExponential(4)} mol/L`]
            };
          } else {
            if (s_in <= 0) throw new Error('Solubility must be positive.');
            const coeff = Math.pow(m, m) * Math.pow(n, n);
            const Ksp_res = coeff * Math.pow(s_in, m + n);
            return {
              value: Ksp_res.toExponential(4), unit: '',
              interp: `Ksp = ${Ksp_res.toExponential(4)}.`,
              steps: [`Ksp = ${m}^${m}×${n}^${n}×s^${m+n}`, `Ksp = ${coeff}×(${s_in})^${m+n}`, `Ksp = ${Ksp_res.toExponential(4)}`]
            };
          }
        }
      },
      {
        id: 'faraday',
        name: "Faraday's Laws of Electrolysis",
        tag: 'Module IV',
        desc: 'Mass deposited during electrolysis. Relevant to corrosion and electrochemical applications in Module IV.',
        equation: 'm = (M · I · t) / (n · F)',
        vars: 'm = mass (g) · M = molar mass (g/mol) · I = current (A) · t = time (s) · n = valency · F = 96485 C/mol',
        inputs: [
          { id: 'M', label: 'Molar Mass', symbol: 'M', unit: 'g/mol', placeholder: '63.55', hint: 'Cu=63.55, Ag=107.87' },
          { id: 'I', label: 'Current', symbol: 'I', unit: 'A', placeholder: '2.0' },
          { id: 't', label: 'Time', symbol: 't', unit: 's', placeholder: '3600', hint: '1 hour = 3600 s' },
          { id: 'n_val', label: 'Valency (electrons)', symbol: 'n', unit: '', placeholder: '2', hint: 'Cu²⁺=2, Ag⁺=1' },
        ],
        calculate(v) {
          const M = +v.M, I = +v.I, t = +v.t, n = +v.n_val, F = 96485;
          if (M <= 0 || I <= 0 || t <= 0 || n <= 0) throw new Error('All values must be positive.');
          const m = (M * I * t) / (n * F);
          const Q = I * t;
          return {
            value: m.toFixed(4), unit: 'grams (g)',
            interp: `Mass deposited = ${m.toFixed(4)} g.\nCharge Q = I×t = ${Q.toFixed(1)} C.`,
            steps: [`Q = I×t = ${I}×${t} = ${Q} C`, `m = M×Q/(n×F) = ${M}×${Q}/(${n}×96485)`, `m = ${m.toFixed(4)} g`]
          };
        }
      },
      {
        id: 'oxidation_potential',
        name: 'Corrosion — Galvanic Series',
        tag: 'Module IV',
        desc: 'EMF of a galvanic corrosion cell. Relevant to corrosion module in Module IV syllabus.',
        equation: 'E°corr = E°cathode − E°anode',
        vars: 'More noble metal acts as cathode; active metal corrodes (anode)',
        inputs: [
          { id: 'E_noble', label: 'Noble Metal E° (cathode)', symbol: 'E°c', unit: 'V', placeholder: '0.34', hint: 'Cu=+0.34, Fe=−0.44' },
          { id: 'E_active', label: 'Active Metal E° (anode)', symbol: 'E°a', unit: 'V', placeholder: '-0.44', hint: 'Zn=−0.76, Al=−1.66' },
          { id: 'n', label: 'Electrons Transferred n', symbol: 'n', unit: '', placeholder: '2' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '298.15' },
        ],
        calculate(v) {
          const Ec = +v.E_noble, Ea = +v.E_active, n = +v.n, T = +v.T, F = 96485, R = 8.314;
          if (n <= 0) throw new Error('n must be positive.');
          if (T <= 0) throw new Error('T must be positive.');
          const E = Ec - Ea;
          const dG = -n * F * E / 1000;
          const tendency = E > 0 ? 'Galvanic corrosion will occur spontaneously.' : 'No galvanic corrosion in this configuration.';
          return {
            value: E.toFixed(4), unit: 'V',
            interp: `E°corr = ${E.toFixed(4)} V. ${tendency}\nΔG = ${dG.toFixed(2)} kJ/mol.`,
            steps: [`E = E°c − E°a = ${Ec}−(${Ea})`, `E = ${E.toFixed(4)} V`, `ΔG=-nFE=${dG.toFixed(2)} kJ/mol`]
          };
        }
      },
      {
        id: 'ellingham',
        name: 'Ellingham Diagram — ΔG°(T)',
        tag: 'Module IV',
        desc: 'Estimates ΔG° of metal oxide formation at any temperature using Ellingham diagram slope/intercept. Used in metallurgy.',
        equation: 'ΔG°(T) = ΔH° − T·ΔS°',
        vars: 'ΔH° = standard enthalpy (kJ/mol) · ΔS° = standard entropy (J/mol·K) · T = temperature (K)',
        inputs: [
          { id: 'dH', label: 'ΔH° of oxidation reaction', symbol: 'ΔH°', unit: 'kJ/mol', placeholder: '-1676', hint: '4Al+3O₂→2Al₂O₃: ΔH°≈-1676' },
          { id: 'dS', label: 'ΔS° of oxidation reaction', symbol: 'ΔS°', unit: 'J/mol·K', placeholder: '-313', hint: 'Negative (loss of O₂ gas)' },
          { id: 'T', label: 'Temperature', symbol: 'T', unit: 'K', placeholder: '1000' },
        ],
        calculate(v) {
          const dH = +v.dH, dS_J = +v.dS, T = +v.T;
          if (T <= 0) throw new Error('Temperature must be positive.');
          const dG = dH - T * (dS_J / 1000);
          let reduce = '';
          if (dG < 0) reduce = 'Oxide forms spontaneously. Metal is likely oxidised.';
          else reduce = 'Oxide is unstable at this T. Reduction is thermodynamically favoured.';
          return {
            value: dG.toFixed(2), unit: 'kJ/mol',
            interp: `ΔG°(${T} K) = ${dG.toFixed(2)} kJ/mol.\n${reduce}`,
            steps: [`ΔG°=ΔH°−TΔS°`, `=${dH}−${T}×${(dS_J/1000).toFixed(4)}`, `=${dG.toFixed(2)} kJ/mol`]
          };
        }
      },
    ]
  },
];

// ─────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────
function toSci(n) {
  if (n === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const mantissa = n / Math.pow(10, exp);
  if (Math.abs(exp) < 4) return n.toPrecision(5);
  return `${mantissa.toFixed(3)}×10^${exp}`;
}

// ─────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────
let activeModule   = null;
let activeFormula  = null;

// ─────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────
function init() {
  buildSidebar();
  buildHomeGrid();
}

// ─────────────────────────────────────────────────────
//  SIDEBAR BUILD
// ─────────────────────────────────────────────────────
function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = MODULES.map(m => `
    <div class="nav-module-group" id="nmg-${m.id}">
      <div class="nav-module-header" id="nmh-${m.id}" onclick="toggleModule('${m.id}')">
        <div class="nmh-icon">${m.icon}</div>
        <div class="nmh-label">${m.label}</div>
        <div class="nmh-count">${m.formulas.length}</div>
        <div class="nmh-arrow">▸</div>
      </div>
      <div class="nav-formula-list" id="nfl-${m.id}">
        ${m.formulas.map(f => `
          <div class="nav-formula-item" id="nfi-${f.id}" onclick="loadFormula('${m.id}','${f.id}')">${f.name}</div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────
//  HOME GRID
// ─────────────────────────────────────────────────────
function buildHomeGrid() {
  const grid = document.getElementById('home-grid');
  grid.innerHTML = MODULES.map(m => `
    <div class="module-card" onclick="openModule('${m.id}')">
      <div class="mc-roman">${m.roman}</div>
      <div class="mc-icon">${m.icon}</div>
      <div class="mc-title">${m.label}</div>
      <div class="mc-desc">${m.desc}</div>
      <div class="mc-meta">
        <span class="mc-pill hours">${m.hours} hrs</span>
        <span class="mc-pill weight">${m.weight}</span>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────────────
function openModule(moduleId) {
  const m = MODULES.find(x => x.id === moduleId);
  if (!m) return;
  expandModule(moduleId);
  loadFormula(moduleId, m.formulas[0].id);
  closeSidebar();
}

function expandModule(moduleId) {
  // Close all others
  MODULES.forEach(m => {
    if (m.id !== moduleId) {
      const h = document.getElementById('nmh-' + m.id);
      const l = document.getElementById('nfl-' + m.id);
      if (h) h.classList.remove('active', 'open');
      if (l) l.classList.remove('open');
    }
  });
  const h = document.getElementById('nmh-' + moduleId);
  const l = document.getElementById('nfl-' + moduleId);
  if (h) { h.classList.add('active', 'open'); }
  if (l) { l.classList.add('open'); }
}

function toggleModule(moduleId) {
  const h = document.getElementById('nmh-' + moduleId);
  const l = document.getElementById('nfl-' + moduleId);
  if (!h || !l) return;
  const isOpen = l.classList.contains('open');
  // Close all
  MODULES.forEach(m => {
    const hh = document.getElementById('nmh-' + m.id);
    const ll = document.getElementById('nfl-' + m.id);
    if (hh) hh.classList.remove('active', 'open');
    if (ll) ll.classList.remove('open');
  });
  if (!isOpen) {
    h.classList.add('active', 'open');
    l.classList.add('open');
  }
}

function loadFormula(moduleId, formulaId) {
  const m = MODULES.find(x => x.id === moduleId);
  if (!m) return;
  const f = m.formulas.find(x => x.id === formulaId);
  if (!f) return;

  activeModule  = m;
  activeFormula = f;

  // Sidebar highlights
  document.querySelectorAll('.nav-formula-item').forEach(el => el.classList.remove('active'));
  const fi = document.getElementById('nfi-' + formulaId);
  if (fi) { fi.classList.add('active'); fi.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }

  expandModule(moduleId);

  // Breadcrumb
  document.getElementById('bc-module').textContent  = m.label;
  document.getElementById('bc-current').textContent = f.name;

  // Header
  document.getElementById('fh-tag').textContent   = f.tag;
  document.getElementById('fh-title').textContent = f.name;
  document.getElementById('fh-desc').textContent  = f.desc;

  // Formula box
  document.getElementById('fb-eq').textContent   = f.equation;
  document.getElementById('fb-vars').innerHTML   = f.vars.split('·').map(s => `<span>${s.trim()}</span>`).join(' &nbsp;·&nbsp; ');

  // Build inputs
  buildInputs(f);

  // Clear result
  resetResult();
  clearError();

  // Switch view
  document.getElementById('home-view').style.display = 'none';
  document.getElementById('calc-view').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeSidebar();
}

// ─────────────────────────────────────────────────────
//  BUILD INPUTS
// ─────────────────────────────────────────────────────
function buildInputs(f) {
  const grid = document.getElementById('input-grid');
  grid.innerHTML = f.inputs.map(inp => {
    if (inp.type === 'select') {
      return `
        <div class="input-group">
          <label class="inp-label">${inp.label}</label>
          <div class="inp-wrap">
            <select class="calc-select" id="inp-${inp.id}">
              ${inp.options.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>
        </div>`;
    }
    return `
      <div class="input-group">
        <label class="inp-label">
          ${inp.symbol ? `<span class="var-chip">${inp.symbol}</span>` : ''}
          ${inp.label}
        </label>
        <div class="inp-wrap">
          <input
            class="calc-input"
            id="inp-${inp.id}"
            type="text"
            inputmode="decimal"
            placeholder="${inp.placeholder || ''}"
            autocomplete="off"
            title="${inp.hint || ''}"
            onkeydown="if(event.key==='Enter')calculate()"
          />
          ${inp.unit ? `<span class="inp-unit">${inp.unit}</span>` : ''}
        </div>
        ${inp.hint ? `<div style="font-size:10.5px;color:var(--text-dim);margin-top:2px;padding-left:2px;">${inp.hint}</div>` : ''}
      </div>`;
  }).join('');
}

// ─────────────────────────────────────────────────────
//  CALCULATE
// ─────────────────────────────────────────────────────
function calculate() {
  if (!activeFormula) return;
  clearError();
  resetResult();

  // Gather values
  const values = {};
  for (const inp of activeFormula.inputs) {
    const el = document.getElementById('inp-' + inp.id);
    if (!el) continue;
    if (inp.type === 'select') {
      values[inp.id] = el.value;
      continue;
    }
    const raw = el.value.trim();
    if (raw === '') {
      showError(`Please fill in "${inp.label}".`);
      el.focus();
      return;
    }
    const num = parseFloat(raw.replace(/×10\^/g, 'e').replace(/×/g,'e'));
    if (isNaN(num)) {
      showError(`"${inp.label}" must be a valid number (e.g. 1.8e-5).`);
      el.focus();
      return;
    }
    values[inp.id] = raw;
  }

  try {
    const result = activeFormula.calculate(values);
    if (!result || result.value === undefined) throw new Error('Calculation returned no result.');
    const val = parseFloat(result.value);
    if (isNaN(val) || !isFinite(val)) throw new Error('Result is undefined or infinite — check input values.');
    showResult(result);
  } catch (e) {
    showError(e.message || 'Calculation error. Check your inputs.');
  }
}

// ─────────────────────────────────────────────────────
//  RESULT
// ─────────────────────────────────────────────────────
function showResult(result) {
  document.getElementById('result-idle').style.display = 'none';
  const card = document.getElementById('result-card');
  card.style.display = 'block';

  document.getElementById('rc-value').textContent  = result.value;
  document.getElementById('rc-unit').textContent   = result.unit;
  document.getElementById('rc-interp').innerHTML   = (result.interp || '').replace(/\n/g, '<br>');

  const stepsEl = document.getElementById('rc-steps');
  if (result.steps && result.steps.length) {
    stepsEl.innerHTML = '<strong style="color:var(--text-muted);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;">Steps</strong><br>' +
      result.steps.map(s => `<div class="step-line">→ ${s}</div>`).join('');
    stepsEl.classList.add('show');
  } else {
    stepsEl.classList.remove('show');
  }
}

function resetResult() {
  document.getElementById('result-idle').style.display = 'flex';
  document.getElementById('result-card').style.display = 'none';
  document.getElementById('rc-steps').classList.remove('show');
}

function resetCalc() {
  document.querySelectorAll('.calc-input').forEach(el => el.value = '');
  document.querySelectorAll('.calc-select').forEach(el => el.selectedIndex = 0);
  resetResult();
  clearError();
}

// ─────────────────────────────────────────────────────
//  ERROR
// ─────────────────────────────────────────────────────
function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.add('show');
}
function clearError() {
  const el = document.getElementById('error-msg');
  el.textContent = '';
  el.classList.remove('show');
}

// ─────────────────────────────────────────────────────
//  SEARCH
// ─────────────────────────────────────────────────────
function filterSidebar(query) {
  const q = query.toLowerCase().trim();
  MODULES.forEach(m => {
    let anyVisible = false;
    m.formulas.forEach(f => {
      const el = document.getElementById('nfi-' + f.id);
      if (!el) return;
      const match = !q || f.name.toLowerCase().includes(q) || m.label.toLowerCase().includes(q);
      el.classList.toggle('hidden', !match);
      if (match) anyVisible = true;
    });
    // Auto-expand if search finds something in this module
    if (q && anyVisible) {
      document.getElementById('nfl-' + m.id)?.classList.add('open');
      document.getElementById('nmh-' + m.id)?.classList.add('active','open');
    } else if (!q) {
      // Don't auto-collapse on clear unless it wasn't open
    }
  });
}

// ─────────────────────────────────────────────────────
//  HOME
// ─────────────────────────────────────────────────────
function goHome() {
  document.getElementById('home-view').style.display = 'flex';
  document.getElementById('calc-view').style.display = 'none';
  document.querySelectorAll('.nav-module-header').forEach(el => el.classList.remove('active','open'));
  document.querySelectorAll('.nav-formula-list').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.nav-formula-item').forEach(el => el.classList.remove('active'));
  activeModule = null;
  activeFormula = null;
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─────────────────────────────────────────────────────
//  SIDEBAR MOBILE
// ─────────────────────────────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  const hb = document.getElementById('hamburger');
  sb.classList.toggle('open');
  ov.classList.toggle('active');
  hb.classList.toggle('open');
}
function closeSidebar() {
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('hamburger').classList.remove('open');
  }
}

// ─────────────────────────────────────────────────────
//  KEYBOARD
// ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

// ─────────────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────────────
init();
