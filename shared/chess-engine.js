/* Small chess engine for Brainy Break: legal moves, special moves, draw rules and a simple AI.
   Board: array of 64, index = row*8+col, row 0 is rank 8. Uppercase = White, lowercase = Black. */
(function (root) {
  'use strict';
  var START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  var KN = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  var KG = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  var DIAG = [[-1,-1],[-1,1],[1,-1],[1,1]], ORTH = [[-1,0],[1,0],[0,-1],[0,1]];
  var VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

  function isWhite(c) { return c !== '' && c === c.toUpperCase(); }
  function colorOf(c) { return isWhite(c) ? 'w' : 'b'; }
  function sqName(i) { return 'abcdefgh'[i % 8] + (8 - (i >> 3)); }
  function sqIndex(n) { return (8 - +n[1]) * 8 + 'abcdefgh'.indexOf(n[0]); }

  function fromFen(fen) {
    var parts = (fen || START).split(' '), b = [], rows = parts[0].split('/');
    for (var r = 0; r < 8; r++) {
      for (var k = 0; k < rows[r].length; k++) {
        var ch = rows[r][k];
        if (/\d/.test(ch)) { for (var n = 0; n < +ch; n++) b.push(''); } else b.push(ch);
      }
    }
    var c = parts[2] || '-';
    return {
      b: b, turn: parts[1] || 'w',
      cast: { K: c.indexOf('K') >= 0, Q: c.indexOf('Q') >= 0, k: c.indexOf('k') >= 0, q: c.indexOf('q') >= 0 },
      ep: parts[3] && parts[3] !== '-' ? sqIndex(parts[3]) : -1,
      half: +(parts[4] || 0), full: +(parts[5] || 1)
    };
  }

  function attacked(b, sq, by) {
    var r = sq >> 3, c = sq & 7, i, d, rr, cc, p, w = by === 'w';
    // pawns
    var pr = w ? r + 1 : r - 1;
    if (pr >= 0 && pr < 8) {
      for (i = -1; i <= 1; i += 2) { cc = c + i; if (cc >= 0 && cc < 8 && b[pr * 8 + cc] === (w ? 'P' : 'p')) return true; }
    }
    for (i = 0; i < 8; i++) {
      rr = r + KN[i][0]; cc = c + KN[i][1];
      if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr * 8 + cc] === (w ? 'N' : 'n')) return true;
      rr = r + KG[i][0]; cc = c + KG[i][1];
      if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr * 8 + cc] === (w ? 'K' : 'k')) return true;
    }
    for (d = 0; d < 4; d++) {
      rr = r + DIAG[d][0]; cc = c + DIAG[d][1];
      while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
        p = b[rr * 8 + cc];
        if (p) { if (p === (w ? 'B' : 'b') || p === (w ? 'Q' : 'q')) return true; break; }
        rr += DIAG[d][0]; cc += DIAG[d][1];
      }
      rr = r + ORTH[d][0]; cc = c + ORTH[d][1];
      while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
        p = b[rr * 8 + cc];
        if (p) { if (p === (w ? 'R' : 'r') || p === (w ? 'Q' : 'q')) return true; break; }
        rr += ORTH[d][0]; cc += ORTH[d][1];
      }
    }
    return false;
  }

  function kingSq(b, color) { return b.indexOf(color === 'w' ? 'K' : 'k'); }
  function inCheck(st, color) { color = color || st.turn; return attacked(st.b, kingSq(st.b, color), color === 'w' ? 'b' : 'w'); }

  // Pseudo-legal moves (may leave own king in check). Move: {f,t,promo?,ep?,castle?,cap?}
  function pseudo(st) {
    var b = st.b, me = st.turn, w = me === 'w', moves = [], f, p, t, r, c, rr, cc, d, i, lp, q;
    function add(f, t, extra) { var m = { f: f, t: t, cap: b[t] || '' }; if (extra) for (var k in extra) m[k] = extra[k]; moves.push(m); }
    for (f = 0; f < 64; f++) {
      p = b[f]; if (!p || isWhite(p) !== w) continue;
      lp = p.toLowerCase(); r = f >> 3; c = f & 7;
      if (lp === 'p') {
        var dir = w ? -1 : 1, start = w ? 6 : 1, last = w ? 0 : 7;
        rr = r + dir;
        if (rr >= 0 && rr < 8 && !b[rr * 8 + c]) {
          if (rr === last) { ['q', 'r', 'b', 'n'].forEach(function (x) { add(f, rr * 8 + c, { promo: x }); }); }
          else {
            add(f, rr * 8 + c);
            if (r === start && !b[(r + 2 * dir) * 8 + c]) add(f, (r + 2 * dir) * 8 + c, { dbl: true });
          }
        }
        for (i = -1; i <= 1; i += 2) {
          cc = c + i; if (cc < 0 || cc > 7 || rr < 0 || rr > 7) continue;
          t = rr * 8 + cc; q = b[t];
          if (q && isWhite(q) !== w) {
            if (rr === last) ['q', 'r', 'b', 'n'].forEach(function (x) { add(f, t, { promo: x }); });
            else add(f, t);
          } else if (t === st.ep && !q) add(f, t, { ep: true, cap: w ? 'p' : 'P' });
        }
      } else if (lp === 'n' || lp === 'k') {
        var D = lp === 'n' ? KN : KG;
        for (i = 0; i < 8; i++) {
          rr = r + D[i][0]; cc = c + D[i][1]; if (rr < 0 || rr > 7 || cc < 0 || cc > 7) continue;
          t = rr * 8 + cc; q = b[t]; if (!q || isWhite(q) !== w) add(f, t);
        }
        if (lp === 'k') {
          var home = w ? 60 : 4, enemy = w ? 'b' : 'w';
          if (f === home && !attacked(b, home, enemy)) {
            if (st.cast[w ? 'K' : 'k'] && b[home + 3] === (w ? 'R' : 'r') && !b[home + 1] && !b[home + 2] && !attacked(b, home + 1, enemy) && !attacked(b, home + 2, enemy)) add(f, home + 2, { castle: 'k' });
            if (st.cast[w ? 'Q' : 'q'] && b[home - 4] === (w ? 'R' : 'r') && !b[home - 1] && !b[home - 2] && !b[home - 3] && !attacked(b, home - 1, enemy) && !attacked(b, home - 2, enemy)) add(f, home - 2, { castle: 'q' });
          }
        }
      } else {
        var dirs = lp === 'b' ? DIAG : lp === 'r' ? ORTH : DIAG.concat(ORTH);
        for (d = 0; d < dirs.length; d++) {
          rr = r + dirs[d][0]; cc = c + dirs[d][1];
          while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
            t = rr * 8 + cc; q = b[t];
            if (q) { if (isWhite(q) !== w) add(f, t); break; }
            add(f, t); rr += dirs[d][0]; cc += dirs[d][1];
          }
        }
      }
    }
    return moves;
  }

  function apply(st, m) {
    var b = st.b.slice(), p = b[m.f], w = isWhite(p), lp = p.toLowerCase();
    var cast = { K: st.cast.K, Q: st.cast.Q, k: st.cast.k, q: st.cast.q };
    b[m.t] = m.promo ? (w ? m.promo.toUpperCase() : m.promo) : p; b[m.f] = '';
    if (m.ep) b[m.t + (w ? 8 : -8)] = '';
    if (m.castle === 'k') { b[m.t - 1] = b[m.t + 1]; b[m.t + 1] = ''; }
    if (m.castle === 'q') { b[m.t + 1] = b[m.t - 2]; b[m.t - 2] = ''; }
    if (lp === 'k') { if (w) { cast.K = false; cast.Q = false; } else { cast.k = false; cast.q = false; } }
    if (m.f === 63 || m.t === 63) cast.K = false;
    if (m.f === 56 || m.t === 56) cast.Q = false;
    if (m.f === 7 || m.t === 7) cast.k = false;
    if (m.f === 0 || m.t === 0) cast.q = false;
    return {
      b: b, turn: st.turn === 'w' ? 'b' : 'w', cast: cast,
      ep: m.dbl ? (m.f + m.t) / 2 : -1,
      half: (lp === 'p' || m.cap) ? 0 : st.half + 1,
      full: st.full + (st.turn === 'b' ? 1 : 0)
    };
  }

  function legal(st) {
    var me = st.turn, out = [], ms = pseudo(st);
    for (var i = 0; i < ms.length; i++) {
      var n = apply(st, ms[i]);
      if (!attacked(n.b, kingSq(n.b, me), n.turn)) out.push(ms[i]);
    }
    return out;
  }

  function insufficient(b) {
    var minors = 0, i, p;
    for (i = 0; i < 64; i++) {
      p = b[i].toLowerCase();
      if (p === 'p' || p === 'r' || p === 'q') return false;
      if (p === 'n' || p === 'b') minors++;
    }
    return minors <= 1;
  }

  function key(st) { return st.b.join('') + st.turn + (st.cast.K ? 'K' : '') + (st.cast.Q ? 'Q' : '') + (st.cast.k ? 'k' : '') + (st.cast.q ? 'q' : '') + st.ep; }

  // result: null | {over:true, type:'checkmate'|'stalemate'|'insufficient'|'fifty'|'repetition', winner?:'w'|'b'}
  function status(st, seen) {
    var moves = legal(st);
    if (!moves.length) return inCheck(st) ? { over: true, type: 'checkmate', winner: st.turn === 'w' ? 'b' : 'w' } : { over: true, type: 'stalemate' };
    if (insufficient(st.b)) return { over: true, type: 'insufficient' };
    if (st.half >= 100) return { over: true, type: 'fifty' };
    if (seen && seen[key(st)] >= 3) return { over: true, type: 'repetition' };
    return null;
  }

  // ---- evaluation & search ----
  var PST_P = [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0];
  var PST_N = [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50];
  var PST_B = [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20];
  var PST_K = [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20];
  function pst(lp, idx) { return lp === 'p' ? PST_P[idx] : lp === 'n' ? PST_N[idx] : lp === 'b' ? PST_B[idx] : lp === 'k' ? PST_K[idx] : 0; }

  // Score from the side-to-move's point of view.
  function evaluate(st) {
    var s = 0, i, p, lp, v;
    for (i = 0; i < 64; i++) {
      p = st.b[i]; if (!p) continue; lp = p.toLowerCase();
      if (isWhite(p)) { s += VAL[lp] + pst(lp, i); } else { s -= VAL[lp] + pst(lp, (7 - (i >> 3)) * 8 + (i & 7)); }
    }
    return st.turn === 'w' ? s : -s;
  }

  function order(moves) {
    return moves.map(function (m) {
      var sc = 0; if (m.cap) sc += 10 * VAL[m.cap.toLowerCase()]; if (m.promo) sc += 800; return { m: m, s: sc };
    }).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.m; });
  }

  var nodes = 0;
  function negamax(st, depth, alpha, beta, ply) {
    nodes++;
    var moves = order(legal(st));
    if (!moves.length) return inCheck(st) ? -100000 + ply : 0;
    if (depth === 0) return evaluate(st);
    var best = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      var sc = -negamax(apply(st, moves[i]), depth - 1, -beta, -alpha, ply + 1);
      if (sc > best) best = sc;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break;
    }
    return best;
  }

  // Returns all legal moves with scores, best first.
  function scoreMoves(st, depth) {
    var moves = order(legal(st)), res = [];
    for (var i = 0; i < moves.length; i++) {
      res.push({ m: moves[i], s: -negamax(apply(st, moves[i]), depth - 1, -Infinity, Infinity, 1) });
    }
    return res.sort(function (a, b) { return b.s - a.s; });
  }

  // level: easy | standard | challenge
  function chooseMove(st, level) {
    var cfg = { easy: { d: 1, slack: 120 }, standard: { d: 2, slack: 25 }, challenge: { d: 3, slack: 0 } }[level] || { d: 2, slack: 25 };
    var res = scoreMoves(st, cfg.d); if (!res.length) return null;
    var top = res[0].s, pool = res.filter(function (x) { return x.s >= top - cfg.slack; });
    return pool[Math.floor(Math.random() * pool.length)].m;
  }

  function perft(st, depth) {
    if (depth === 0) return 1;
    var ms = legal(st), n = 0;
    for (var i = 0; i < ms.length; i++) n += depth === 1 ? 1 : perft(apply(st, ms[i]), depth - 1);
    return n;
  }

  var api = { START: START, fromFen: fromFen, legal: legal, apply: apply, inCheck: inCheck, status: status, key: key, chooseMove: chooseMove, scoreMoves: scoreMoves, perft: perft, sqName: sqName, sqIndex: sqIndex, isWhite: isWhite, kingSq: kingSq, VAL: VAL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ChessEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
