G.CHESS = {
    task_mate_3: [[1, 4, 2], [1, 5, 2], [1, 6, -1], [1, 7, -6], [2, 4, 4],
    [3, 4, 1], [3, 5, -1], [3, 6, -1], [3, 7, 6],
[5, 4, -5], [5, 5, 1], [5, 6, -1], [5, 7, 4]],
    task_mate_5: [[0, 4, -1], [0, 5, 1], [1, 5, -1], [1, 6, 4], [2, 0, 6], [2, 4, -1], [2, 5, 4], [3, 4, 1],
[4, 2, 3], [4, 3, 1], [5, 2, 3], [6, 1, -4], [6, 3, -1], [6, 4, 1], [7, 0, -6], [7, 1, -4], [7, 2, -3]],
    task_mate_0: [[0, 0, 3], [0, 1, 2], [0, 2, -4], [0, 3, -1], [1, 2, -6],
[2, 0, 4], [2, 2, 1], [2, 3, -1], [3, 2, 1], [3, 3, 6], [6, 7, 3], [7, 6, 1]],

    f_64_with_fig: function(arr_fig) {
        var m = [];
        var row = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i <= 7; i++) {
            m.push(row.slice());
        }
        for (var j = 0; j < arr_fig.length; j++) {
            m[arr_fig[j][0]][arr_fig[j][1]] = arr_fig[j][2];
        }
        return m;
    }
};

G.DRAW = {
    f_add_innerHTML: function(my_text, svg) {
        svg.innerHTML = svg.innerHTML + my_text;
    },
    f_el_line: function(a, b, RGB, stroke_width) {
        var pa = 'x1="' + a.x + '" y1="' + a.y + '"';
        var pb = 'x2="' + b.x + '" y2="' + b.y + '"';
        var style = 'stroke-linecap="round" stroke="' + RGB + '" stroke-width="' + stroke_width + '"';
        return '<line ' + pa + ' ' + pb + ' ' + style + ' />';
    },
    f_el_text: function(str, center, class_name) {
        var xy = 'x="' + center.x + '" y="' + center.y + '"';
        var middle = '<text text-anchor="middle" dominant-baseline="central" ';
        return (middle + xy + ' class="' + class_name + '">' + str + '</text>');
    },

    f_el_chess_fig: function(who_0_1, fig_1_6, xy_07, BOARD, class_name) {
        var str = G.ARR_FIG[who_0_1][fig_1_6];
        var center = BOARD.f_center_nxy(xy_07);
        var shift_down = G.SETTING.shift_down.f_op_scale(G.SETTING.XY.board_wh.y * 0.125);
        return G.DRAW.f_el_text(str, center.f_op_minus(shift_down), class_name);
    },

    f_el_rect: function(center, wh, color) {
        var left_top = 'x="' + (center.x - wh.x * 0.5) + '" y="' + (center.y - wh.y * 0.5) + '"';
        var sizes = 'width="' + wh.x + '" height="' + wh.y + '"';
        return '<rect ' + left_top + ' ' + sizes + ' stroke="none" fill="' + color + '"/>';
    },

    f_el_black_cell: function(center, wh, color, stroke_width) {
        var n_sections = G.SETTING.W.black_cell_amount_of_cross_lines_on_the_half;
        var p0 = center.f_op_minus(wh.f_op_scale(0.5));
        var dx = wh.x / n_sections;
        var dy = wh.y / n_sections;

        function f_new_ab(axy, bxy) {
            var da = new G.F_XY(dx * axy[0], dy * axy[1]);
            var db = new G.F_XY(dx * bxy[0], dy * bxy[1]);
            return new G.F_AB(p0.f_op_plus(da), p0.f_op_plus(db))
        };

        function f_new_string_for_ab(n, bool_is_left_down) {
            var nn = bool_is_left_down ? [n, 0] : [n, n_sections];
            var ab = f_new_ab([nn[0], nn[1]], [nn[1], nn[0]]);
            return G.DRAW.f_el_line(ab.a, ab.b, color, stroke_width)
        };

        var str = f_new_string_for_ab(n_sections, false);
        for (var i = 0; i < n_sections; i++) {
            str += f_new_string_for_ab(i, true);
            str += f_new_string_for_ab(i, false);
        };

        return str;
    },

    f_el_grid: function(BOARD, matrix_posit) {
        var s = "",
            cell_center;

        function f_add_fig(nx, ny, nf) {
            if (nf == 0) {return ""; }
            var who = (nf >= 0) ? 0 : 1;
            var fig = (nf >= 0) ? nf : (-nf);
            var el = G.DRAW.f_el_chess_fig(who, fig, new G.F_XY(nx, ny), G.BOARD, "class_figures");
            return el;
        };

        for (ix = 0; ix <= 7; ix++) {
            for (iy = 0; iy <= 7; iy++) {
                if (((ix + iy) % 2) == 1) {
                    cell_center = BOARD.f_center_nxy(new G.F_XY(ix, iy));
                    s = s + this.f_el_black_cell(
                        cell_center,
                        BOARD.f_cell_wh(),
                        G.SETTING.RGB.board_black_cross,
                        G.SETTING.W.black_cell);
                    //debugger
                };
                s = s + f_add_fig(ix, iy, matrix_posit[ix][iy]) + "\n\n\n";
            };
        };
        return s;
    },
    
    f_mate_task: function (gotten_svg, mate_task_string) {
        var opacity_backgroung_rect = G.DRAW.f_el_rect(G.BOARD.c00, G.BOARD.wh, G.SETTING.RGB.background);
        
        G.DRAW.f_add_innerHTML(opacity_backgroung_rect, gotten_svg);

        G.DRAW.f_add_innerHTML(G.BOARD.f_style_class_figures(), gotten_svg);
    
        var m64 = G.CHESS.f_64_with_fig(mate_task_string);
    
        G.DRAW.f_add_innerHTML(G.DRAW.f_el_grid(G.BOARD, m64), gotten_svg);
    }
};


G.DRAW.f_mate_task(document.getElementById("id_svg_mate_3"), G.CHESS.task_mate_3);
G.DRAW.f_mate_task(document.getElementById("id_svg_mate_5"), G.CHESS.task_mate_5);
G.DRAW.f_mate_task(document.getElementById("id_svg_mate_0"), G.CHESS.task_mate_0);