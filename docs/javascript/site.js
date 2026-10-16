// Mem4Act project page interactions.
(function () {
  'use strict';

  // ---------- Data ----------
  const BASELINES = ['MME-VLA (Frame Sampling)', 'GPT-6', 'π0.5'];
  const REAL_TASKS = [
    {
      name: 'Cover Blocks', key: 'cup',
      info: 'On the table, red, green, and blue blocks are arranged randomly along with three cups. From the current viewpoint, cover the blocks from left to right using the cups, and then uncover them again in the sequence red, green, and blue.',
    },
    {
      name: 'Rearrange Blocks', key: '2mat',
      info: 'Move the block between the two mats onto the empty mat, press the button, then move the other block (the one that started on a mat) to the space between the two mats.',
    },
    {
      name: 'Swap Blocks', key: '3bowl',
      info: 'There are three bowls on the table, and two blocks are placed in two different bowls. You may move only one block at a time, and each bowl can hold at most one block. Swap the positions of the two blocks. Finally, press the button.',
    },
    {
      name: 'Put Block Back', key: '4mat',
      info: 'There are four mats, one block, and a button on the table. One block is on one of the mats. First, put the block in the center, then press the button. Then, put the block back in its original position.',
    },
  ];
  const REAL_FILES = { 'Mem4Act': 'mem4act', 'MME-VLA (Frame Sampling)': 'framesamp', 'GPT-6': 'gpt6', 'π0.5': 'pi0.5' };
  const realSrc = (task, method) => 'img/real/Real-' + task.key + '-' + REAL_FILES[method] + '.mp4';

  // Videos in each suite fill the grid in list order (first = top-left).
  const ROBOMME_SUITES = [
    {
      name: 'Counting', infoLabel: 'Temporal memory:',
      info: 'accumulate and reason over past events, such as how many times an action has already been repeated.',
      videos: [
        { label: 'BinFill', tag: '1.1', src: 'img/robomme/RoboMME-binfill.mp4' },
        { label: 'PickXtimes', tag: '1.2', src: 'img/robomme/RoboMME-pickxtimes.mp4' },
        { label: 'SwingXtimes', tag: '1.3', src: 'img/robomme/RoboMME-swingxtimes.mp4' },
        { label: 'StopCube', tag: '1.4', src: 'img/robomme/RoboMME-stopcube.mp4' },
      ],
    },
    {
      name: 'Permanence', infoLabel: 'Spatial memory:',
      info: 'track where objects are as they become occluded or the scene changes.',
      videos: [
        { label: 'VideoUnmask', tag: '2.1', src: 'img/robomme/RoboMME-videounmask.mp4' },
        { label: 'ButtonUnmask', tag: '2.2', src: 'img/robomme/RoboMME-buttonunmask.mp4' },
        { label: 'VideoUnmaskSwap', tag: '2.3', src: 'img/robomme/RoboMME-videounmaskswap.mp4' },
        { label: 'ButtonUnmaskSwap', tag: '2.4', src: 'img/robomme/RoboMME-buttonunmaskswap.mp4' },
      ],
    },
    {
      name: 'Reference', infoLabel: 'Object memory:',
      info: 'identify the right object from earlier cues, such as highlights or what happened in a video.',
      videos: [
        { label: 'PickHighlight', tag: '3.1', src: 'img/robomme/RoboMME-pickhighlight.mp4' },
        { label: 'VideoRepick', tag: '3.2', src: 'img/robomme/RoboMME-videorepick.mp4' },
        { label: 'VideoPlaceButton', tag: '3.3', src: 'img/robomme/RoboMME-videopressbutton.mp4' },
        { label: 'VideoPlaceOrder', tag: '3.4', src: 'img/robomme/RoboMME-videoplaceorder.mp4' },
      ],
    },
    {
      name: 'Imitation', infoLabel: 'Procedural memory:',
      info: 'reproduce a behavior that was demonstrated earlier in a video.',
      videos: [
        { label: 'MoveCube', tag: '4.1', src: 'img/robomme/RoboMME-MoveCube.mp4' },
        { label: 'InsertPeg', tag: '4.2', src: 'img/robomme/RoboMME-insertpeg.mp4' },
        { label: 'PatternLock', tag: '4.3', src: 'img/robomme/RoboMME-partternlock.mp4' },
        { label: 'RouteStick', tag: '4.4', src: 'img/robomme/RoboMME-routestick.mp4' },
      ],
    },
  ];
  const RMBENCH_GROUPS = [
    {
      name: 'M(1) tasks', infoLabel: 'Single-observation memory:',
      info: 'retain one past observation or a fixed, small number of past frames, such as a hidden reference object or where a block started.',
      videos: [
        { label: 'Observe and Pick Up', src: 'img/rmbench/RMBench-observeandpickup.mp4' },
        { label: 'Rearrange Blocks', src: 'img/rmbench/RMBench-rearrangeblocks.mp4' },
        { label: 'Put Back Block', src: 'img/rmbench/RMBench-PutBackBlock.mp4' },
        { label: 'Swap Blocks', src: 'img/rmbench/RMBench-Swapblock.mp4' },
        { label: 'Swap T', src: 'img/rmbench/RMBench-SwapT.mp4' },
      ],
    },
    {
      name: 'M(n) tasks', infoLabel: 'Accumulated memory:',
      info: 'keep building up history over repeated exploration and trial and error, such as which attempts already failed or how many times a step has been done.',
      videos: [
        { label: 'Blocks Ranking Try', src: 'img/rmbench/RMBench-blockranking.mp4' },
        { label: 'Battery Try', src: 'img/rmbench/RMBench-Battery.mp4' },
        { label: 'Cover Blocks', src: 'img/rmbench/RMBench-uncoverblock.mp4' },
        { label: 'Press Button', src: 'img/rmbench/RMBench-ButtonClick.mp4' },
      ],
    },
  ];
  // Overall success rates from Tables 1-3 of the paper (selected baselines).
  const RESULTS = [
    { name: 'RoboMME', meta: '16 tasks · counting, permanence, reference, imitation',
      rows: [['π0.5', 17.93], ['TokenDrop+Modul', 38.04], ['MemER', 42.38], ['FrameSamp+Modul', 44.51], ['Mem4Act', 49.88, true]] },
    { name: 'RMBench', meta: '9 tasks · M(1) single-observation and M(n) accumulated memory',
      rows: [['π0.5', 10.4], ['HAMLET†', 23.4], ['Mem-0', 42.0], ['NativeMEM†', 48.7], ['Mem4Act', 61.0, true]] },
    { name: 'Real world', meta: '4 tasks · 50 rollouts each · cover, swap, rearrange, put back',
      rows: [['Mem-0', 22.5], ['π0.5', 28.0], ['MME-VLA', 42.0], ['GPT-6 Astra', 42.5], ['Mem4Act', 81.5, true]] },
  ];

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // Play videos only while they are on screen.
  const videoObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.play().catch(() => {});
          else e.target.pause();
        });
      }, { threshold: 0.2 })
    : null;

  function makeVideo(src) {
    const v = document.createElement('video');
    v.src = src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.controls = true;
    v.preload = 'metadata';
    v.setAttribute('muted', '');
    if (videoObserver) videoObserver.observe(v);
    else { v.autoplay = true; }
    return v;
  }

  function videoCard(label, src, opts) {
    opts = opts || {};
    const card = el('figure', 'vcard' + (opts.ours ? ' is-ours' : ''));
    const head = el('figcaption', 'vlabel');
    const name = el('span', null, label);
    head.appendChild(name);
    if (opts.badge) head.appendChild(el('span', 'badge' + (opts.ours ? '' : ' muted'), opts.badge));
    else if (opts.tag) head.appendChild(el('small', null, 'Task ' + opts.tag));
    card.append(head, makeVideo(src));
    return card;
  }

  function clearGrid(grid) {
    grid.querySelectorAll('video').forEach((v) => {
      if (videoObserver) videoObserver.unobserve(v);
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
    grid.innerHTML = '';
  }

  function buildChips(container, items, onSelect) {
    const buttons = items.map((item, i) => {
      const b = el('button', null, typeof item === 'string' ? item : item.name);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.addEventListener('click', () => select(i));
      container.appendChild(b);
      return b;
    });
    function select(i) {
      buttons.forEach((b, j) => {
        b.classList.toggle('is-active', i === j);
        b.setAttribute('aria-selected', i === j ? 'true' : 'false');
      });
      onSelect(i);
    }
    return select;
  }

  // ---------- Theme ----------
  $('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('mem4act-theme', next); } catch (e) {}
  });

  // ---------- Reading progress + current nav ----------
  const progress = $('progress');
  const navLinks = Array.from(document.querySelectorAll('.topnav a'));
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href')));
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    let current = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 140) current = i; });
    if (max > 0 && max - h.scrollTop < 4) current = sections.length - 1;
    navLinks.forEach((a, i) => a.classList.toggle('is-current', i === current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Teaser ----------
  (function teaser() {
    const video = $('teaser-video');
    const bar = $('teaser-progress');
    const tasksEl = $('teaser-tasks');
    let index = 0;
    const buttons = REAL_TASKS.map((task, i) => {
      const b = el('button', 'teaser-task');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.append(el('small', null, String(i + 1).padStart(2, '0')), el('span', null, task.name));
      b.addEventListener('click', () => show(i, true));
      tasksEl.appendChild(b);
      return b;
    });
    function show(i, userAction) {
      index = i;
      const task = REAL_TASKS[i];
      buttons.forEach((b, j) => {
        b.classList.toggle('is-active', i === j);
        b.setAttribute('aria-selected', i === j ? 'true' : 'false');
      });
      $('teaser-title').textContent = task.name;
      $('teaser-count').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(REAL_TASKS.length).padStart(2, '0');
      $('teaser-instr').innerHTML = '<b>Instruction:</b> ' + task.info;
      video.src = realSrc(task, 'Mem4Act');
      bar.style.width = '0';
      if (userAction || inView) video.play().catch(() => {});
    }
    let inView = true;
    video.addEventListener('timeupdate', () => {
      if (video.duration) bar.style.width = (video.currentTime / video.duration) * 100 + '%';
    });
    video.addEventListener('ended', () => show((index + 1) % REAL_TASKS.length));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView) video.play().catch(() => {}); else video.pause();
      }, { threshold: 0.25 }).observe(video);
    }
    show(0);
  })();

  // ---------- Results chart ----------
  (function chart() {
    const bars = $('bars');
    const tip = $('bars-tip');
    const meta = $('chart-meta');
    let animated = false;
    let pending = null;

    function render(i) {
      const r = RESULTS[i];
      meta.textContent = r.meta;
      bars.innerHTML = '';
      const best = Math.max.apply(null, r.rows.filter((x) => !x[2]).map((x) => x[1]));
      const fills = [];
      r.rows.forEach((row) => {
        const ours = !!row[2];
        const line = el('div', 'bar-row' + (ours ? ' is-ours' : ''));
        const track = el('div', 'bar-track');
        const fill = el('div', 'bar-fill');
        const val = el('span', 'bar-val', row[1] + '%');
        if (ours) val.appendChild(el('span', 'gain', '+' + (row[1] - best).toFixed(1) + ' pp'));
        track.append(fill, val);
        line.append(el('div', 'bar-name', row[0]), track);
        line.setAttribute('aria-label', row[0] + ': ' + row[1] + '% success on ' + r.name);
        line.addEventListener('mousemove', (e) => {
          tip.textContent = row[0] + ' · ' + row[1] + '% on ' + r.name;
          tip.style.left = e.clientX + 14 + 'px';
          tip.style.top = e.clientY - 34 + 'px';
          tip.style.opacity = '1';
        });
        line.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
        bars.appendChild(line);
        fills.push([fill, row[1]]);
      });
      // Bar width is relative to the track minus room for the value label.
      const grow = () => fills.forEach(([f, v]) => { f.style.width = 'calc((100% - var(--label-room)) * ' + v / 100 + ')'; });
      if (animated) requestAnimationFrame(() => requestAnimationFrame(grow));
      else pending = grow;
    }

    const select = buildChips($('chart-tabs'), RESULTS, render);
    select(0);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animated = true;
          if (pending) requestAnimationFrame(pending);
          io.disconnect();
        }
      }, { threshold: 0.3 });
      io.observe(bars);
    } else { animated = true; pending && pending(); }
  })();

  // ---------- Demonstrations ----------
  (function demos() {
    // Setting tabs
    const tabButtons = Array.from(document.querySelectorAll('#demo-tabs button'));
    const panels = {};
    tabButtons.forEach((b) => {
      const name = b.dataset.panel;
      panels[name] = $('panel-' + name);
      b.setAttribute('role', 'tab');
      b.addEventListener('click', () => {
        tabButtons.forEach((x) => {
          x.classList.toggle('is-active', x === b);
          x.setAttribute('aria-selected', x === b ? 'true' : 'false');
        });
        Object.keys(panels).forEach((k) => {
          const on = k === name;
          panels[k].classList.toggle('is-active', on);
          if (!on) panels[k].querySelectorAll('video').forEach((v) => v.pause());
        });
        if (!panels[name].dataset.ready) init[name]();
      });
    });

    const init = {
      real() {
        $('panel-real').dataset.ready = '1';
        const grid = $('real-grid');
        let task = 0;
        let baseline = 0;
        function draw() {
          clearGrid(grid);
          const t = REAL_TASKS[task];
          $('real-info').innerHTML = '<b>Instruction:</b> ' + t.info;
          grid.append(
            videoCard('Mem4Act', realSrc(t, 'Mem4Act'), { ours: true, badge: 'Ours' }),
            videoCard(BASELINES[baseline], realSrc(t, BASELINES[baseline]), { badge: 'Baseline' })
          );
        }
        const selTask = buildChips($('real-chips'), REAL_TASKS, (i) => { task = i; if (ready) draw(); });
        const selBase = buildChips($('real-baselines'), BASELINES, (i) => { baseline = i; if (ready) draw(); });
        let ready = false;
        selTask(0); selBase(0);
        ready = true;
        draw();
      },
      robomme() { simple('robomme', ROBOMME_SUITES, (s, i) => 'Suite ' + (i + 1) + ': ' + s.name); },
      rmbench() { simple('rmbench', RMBENCH_GROUPS, (s) => s.name); },
    };

    function simple(prefix, groups, chipName) {
      $('panel-' + prefix).dataset.ready = '1';
      const grid = $(prefix + '-grid');
      buildChips($(prefix + '-chips'), groups.map((g, i) => chipName(g, i)), (i) => {
        const g = groups[i];
        $(prefix + '-info').innerHTML = '<b>' + g.infoLabel + '</b> ' + g.info;
        clearGrid(grid);
        g.videos.forEach((v) => grid.appendChild(videoCard(v.label, v.src, { tag: v.tag })));
      })(0);
    }

    init.real();
  })();

  // ---------- Ablations (Tables 4 and 5 of the paper) ----------
  (function ablations() {
    const tip = $('bars-tip');
    function tooltip(node, text) {
      node.addEventListener('mousemove', (e) => {
        tip.textContent = typeof text === 'function' ? text() : text;
        tip.style.left = e.clientX + 14 + 'px';
        tip.style.top = e.clientY - 34 + 'px';
        tip.style.opacity = '1';
      });
      node.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    }
    const fmt = (v) => v.toFixed(2);
    const timers = new Map();
    function later(key, fn, ms) {
      const list = timers.get(key) || [];
      list.push(setTimeout(fn, ms));
      timers.set(key, list);
    }
    function cancel(key) { (timers.get(key) || []).forEach(clearTimeout); timers.set(key, []); }

    // Horizontal bars; widths leave 64px for the value label.
    function hbars(host, rows, max) {
      const pos = (v) => 'calc((100% - 64px) * ' + v / max + ')';
      const box = el('div', 'hb');
      const items = rows.map((r) => {
        const row = el('div', 'hb-row' + (r.hl ? ' is-hl' : ''));
        const name = el('div', 'hb-name', r.name);
        if (r.sub) name.appendChild(el('small', null, r.sub));
        const track = el('div', 'hb-track');
        const ghost = el('div', 'hb-ghost');
        const fill = el('div', 'hb-fill');
        const val = el('span', 'hb-val');
        const num = el('span');
        const drop = el('span', 'hb-drop');
        val.append(num, drop);
        track.append(ghost, fill, val);
        row.append(name, track);
        box.appendChild(row);
        return { r, ghost, fill, val, num, drop, row };
      });
      const axis = el('div', 'hb-axis');
      const ticks = el('div');
      for (let t = 0; t <= max; t += 20) {
        const sp = el('span', null, t === max ? t + '%' : String(t));
        sp.style.left = pos(t);
        ticks.appendChild(sp);
      }
      axis.append(el('span'), ticks);
      host.append(box, axis);
      return {
        items,
        reset() {
          items.forEach((it) => { it.fill.style.width = '0'; it.val.style.left = '0'; it.val.style.opacity = '0'; });
        },
        set(key, stagger) {
          items.forEach((it, i) => {
            later(host, () => {
              const v = it.r[key];
              it.fill.style.width = pos(v);
              it.val.style.left = pos(v);
              it.val.style.opacity = '1';
              it.num.textContent = fmt(v) + '%';
            }, (stagger || 0) * i);
          });
        },
        pos,
      };
    }

    const charts = {};

    // Q1a: memory capacity line chart
    charts.capacity = (host) => {
      const data = [[128, 40.13], [256, 44.25], [512, 49.88], [1024, 42.75]];
      const ref = 33.25;
      const W = 460, H = 240, m = { l: 34, r: 18, t: 26, b: 40 };
      const x = (i) => m.l + 18 + i * ((W - m.l - m.r - 36) / (data.length - 1));
      const y = (v) => m.t + (52 - v) / (52 - 30) * (H - m.t - m.b);
      const ns = 'http://www.w3.org/2000/svg';
      const mk = (tag, attrs, text) => {
        const n = document.createElementNS(ns, tag);
        Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
        if (text != null) n.textContent = text;
        return n;
      };
      host.classList.add('lc');
      const svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Overall success versus memory tokens: 128 tokens 40.13%, 256 tokens 44.25%, 512 tokens 49.88%, 1024 tokens 42.75%; full-history attention 33.25%' });
      const defs = mk('defs', {});
      const grad = mk('linearGradient', { id: 'lc-grad', x1: 0, y1: 0, x2: 0, y2: 1 });
      grad.append(mk('stop', { offset: '0', 'stop-color': 'var(--accent-bright)', 'stop-opacity': '.22' }), mk('stop', { offset: '1', 'stop-color': 'var(--accent-bright)', 'stop-opacity': '0' }));
      defs.appendChild(grad);
      svg.appendChild(defs);
      const grid = mk('g', { class: 'grid' });
      [30, 35, 40, 45, 50].forEach((t) => {
        grid.appendChild(mk('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t) }));
        svg.appendChild(mk('text', { class: 'axis-t', x: m.l - 6, y: y(t) + 4, 'text-anchor': 'end' }, t));
      });
      svg.insertBefore(grid, svg.firstChild.nextSibling);
      svg.appendChild(mk('line', { class: 'ref', x1: m.l, x2: W - m.r, y1: y(ref), y2: y(ref) }));
      svg.appendChild(mk('text', { class: 'ref-t', x: W - m.r, y: y(ref) - 6, 'text-anchor': 'end' }, 'Full history, no masking (512 tokens) · 33.25'));
      const pts = data.map((d, i) => [x(i), y(d[1])]);
      const line = 'M' + pts.map((p) => p.join(',')).join(' L');
      svg.appendChild(mk('path', { class: 'area', d: line + ' L' + pts[pts.length - 1][0] + ',' + (H - m.b) + ' L' + pts[0][0] + ',' + (H - m.b) + ' Z' }));
      svg.appendChild(mk('path', { class: 'line', d: line, pathLength: 1 }));
      const dots = data.map((d, i) => {
        const peak = d[0] === 512;
        const c = mk('circle', { class: 'pt' + (peak ? ' is-peak' : ''), cx: pts[i][0], cy: pts[i][1], r: peak ? 6.5 : 5 });
        const t = mk('text', { class: 'pt-t', x: pts[i][0], y: pts[i][1] - 13, 'text-anchor': 'middle' }, fmt(d[1]));
        svg.append(c, t);
        svg.appendChild(mk('text', { class: 'x-t', x: pts[i][0], y: H - m.b + 18, 'text-anchor': 'middle' }, d[0]));
        const hit = mk('circle', { class: 'hit', cx: pts[i][0], cy: pts[i][1], r: 16 });
        svg.appendChild(hit);
        tooltip(hit, d[0] + ' memory tokens · ' + fmt(d[1]) + '%');
        return [c, t];
      });
      svg.appendChild(mk('text', { class: 'axis-t', x: (m.l + W - m.r) / 2, y: H - 4, 'text-anchor': 'middle' }, 'memory tokens'));
      host.appendChild(svg);
      return {
        reset() { host.classList.remove('is-in'); dots.forEach(([c, t]) => { c.style.opacity = '0'; t.style.opacity = '0'; }); },
        play() {
          void host.offsetWidth;
          host.classList.add('is-in');
          dots.forEach(([c, t], i) => later(host, () => { c.style.opacity = '1'; t.style.opacity = '1'; }, 250 + i * 330));
        },
      };
    };

    // Q1b: temporal structure bars
    charts.structure = (host) => {
      const rows = [
        { name: 'No masking', sub: 'full history', v: 33.25 },
        { name: 'Single-scale', sub: '32', v: 36.0 },
        { name: 'Repeated', sub: '32→32→32', v: 36.88 },
        { name: 'Two-level', sub: '32→8', v: 43.13 },
        { name: 'Coarser', sub: '16→8→4', v: 45.13 },
        { name: 'Default (ours)', sub: '32→16→8', v: 49.88, hl: true },
        { name: 'Finer', sub: '64→32→16', v: 47.0 },
      ];
      const hb = hbars(host, rows, 60);
      hb.items.forEach((it) => tooltip(it.row, it.r.name + ' (' + it.r.sub + ') · ' + fmt(it.r.v) + '%'));
      return { reset: hb.reset, play() { hb.set('v', 110); } };
    };

    // Q2: grouped columns, one supervision recipe at a time
    charts.supervision = (host) => {
      const series = ['Action only', '+ QA', '+ DINO', '+ QA + DINO (ours)'];
      const groups = ['Semantic', 'Perceptual', 'Both', 'Overall'];
      const vals = [[46.8, 58.8, 55.6, 61.6], [29.67, 45.33, 50.67, 50.33], [18.4, 25.2, 28.8, 37.6], [31.5, 43.25, 45.38, 49.88]];
      const max = 70;
      const legend = $('q2-legend');
      series.forEach((s, i) => {
        const sp = el('span');
        const sw = el('i');
        sw.style.background = 'var(--s' + i + ')';
        sp.append(sw, document.createTextNode(s));
        legend.appendChild(sp);
      });
      const gc = el('div', 'gc');
      const yAxis = el('div', 'gc-y');
      const plot = el('div', 'gc-plot');
      [0, 20, 40, 60].forEach((t) => {
        const sp = el('span', null, t);
        sp.style.bottom = (t / max) * 100 + '%';
        yAxis.appendChild(sp);
        if (t) {
          const g = el('div', 'gc-grid');
          g.style.bottom = (t / max) * 100 + '%';
          plot.appendChild(g);
        }
      });
      const bars = [];
      vals.forEach((gv, gi) => {
        const g = el('div', 'gc-group');
        const top = Math.max.apply(null, gv);
        gv.forEach((v, si) => {
          const b = el('div', 'gc-bar' + (v === top ? ' is-top' : ''));
          b.style.background = 'var(--s' + si + ')';
          b.appendChild(el('b', null, fmt(v)));
          tooltip(b, groups[gi] + ' · ' + series[si].replace(' (ours)', '') + ' · ' + fmt(v) + '%');
          g.appendChild(b);
          bars.push({ b, v, si });
        });
        plot.appendChild(g);
      });
      gc.append(yAxis, plot);
      const xl = el('div', 'gc-x');
      const xr = el('div');
      groups.forEach((g) => xr.appendChild(el('span', null, g)));
      xl.append(el('span'), xr);
      host.append(gc, xl);
      return {
        reset() { bars.forEach(({ b }) => { b.style.height = '0'; b.querySelector('b').style.visibility = 'hidden'; }); },
        play() {
          bars.forEach(({ b, v, si }) => later(host, () => { b.style.height = (v / max) * 100 + '%'; }, si * 420));
          later(host, () => bars.forEach(({ b }) => { b.querySelector('b').style.visibility = ''; }), 3 * 420 + 700);
        },
      };
    };

    // Q3: stage-2 memory update
    charts.adapt = (host) => {
      const rows = [
        { name: 'One-stage', sub: 'all losses jointly', v: 33.38 },
        { name: 'Two-stage', sub: 'memory frozen', v: 18.38 },
        { name: 'Two-stage', sub: '1.0× LR', v: 43.25 },
        { name: 'Two-stage (ours)', sub: '0.1× LR', v: 49.88, hl: true },
      ];
      const hb = hbars(host, rows, 60);
      hb.items.forEach((it) => tooltip(it.row, it.r.name + ', ' + it.r.sub + ' · ' + fmt(it.r.v) + '%'));
      return { reset: hb.reset, play() { hb.set('v', 180); } };
    };

    // Q4: history swap, bars shrink from correct to mismatched history
    charts.swap = (host) => {
      const rows = [
        { name: 'One-stage', sub: 'all losses', correct: 33.38, mismatch: 16.63 },
        { name: 'Two-stage', sub: 'frozen', correct: 18.38, mismatch: 6.75 },
        { name: 'Two-stage (ours)', sub: '0.1× LR', correct: 49.88, mismatch: 16.13, hl: true },
        { name: 'Two-stage', sub: '1.0× LR', correct: 43.25, mismatch: 19.63 },
      ];
      const hb = hbars(host, rows, 60);
      hb.items.forEach((it) => {
        it.ghost.style.width = hb.pos(it.r.correct);
        it.drop.textContent = '−' + fmt(it.r.correct - it.r.mismatch);
        tooltip(it.row, () => it.r.name + ', ' + it.r.sub + ' · correct ' + fmt(it.r.correct) + '% → swapped ' + fmt(it.r.mismatch) + '%');
      });
      const toggle = Array.from(document.querySelectorAll('#q4-toggle button'));
      function show(state, stagger) {
        toggle.forEach((b) => {
          b.classList.toggle('is-active', b.dataset.state === state);
          b.setAttribute('aria-selected', b.dataset.state === state ? 'true' : 'false');
        });
        host.classList.toggle('is-swapped', state === 'mismatch');
        hb.set(state, stagger);
      }
      toggle.forEach((b) => b.addEventListener('click', () => { cancel(host); show(b.dataset.state, 0); }));
      return {
        reset() { host.classList.remove('is-swapped'); hb.reset(); },
        play() {
          show('correct', 120);
          later(host, () => show('mismatch', 140), 2200);
        },
      };
    };

    // Build each question's charts and play them when they scroll into view.
    document.querySelectorAll('.rq').forEach((card) => {
      const list = Array.from(card.querySelectorAll('[data-chart]')).map((host) => ({ host, c: charts[host.dataset.chart](host) }));
      const run = () => list.forEach(({ host, c }) => { cancel(host); c.reset(); requestAnimationFrame(() => requestAnimationFrame(() => c.play())); });
      list.forEach(({ c }) => c.reset());
      card.querySelector('.replay').addEventListener('click', run);
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) { run(); io.disconnect(); }
        }, { threshold: 0.35 });
        io.observe(card);
      } else run();
    });
  })();

  // ---------- Lightbox ----------
  const lightbox = $('lightbox');
  const lbImg = lightbox.querySelector('img');
  let lastFocus = null;
  document.querySelectorAll('[data-zoom]').forEach((btn) => {
    btn.addEventListener('click', () => {
      lastFocus = btn;
      lbImg.src = btn.dataset.zoom;
      lbImg.alt = btn.querySelector('img').alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox-close').focus();
    });
  });
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox(); });

  // ---------- Copy BibTeX (when the citation section is enabled) ----------
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = $(btn.dataset.copy).textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
      });
    });
  });
})();
