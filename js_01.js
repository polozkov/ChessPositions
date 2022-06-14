var G = {
    F_XY: function(x, y) {
        this.x = x;
        this.y = y;
    },
    ARR_FIG: [
        ['W', '&#9817', '&#9816', '&#9815', '&#9814', '&#9813', '&#9812'],
        ['B', '&#9823', '&#9822', '&#9821', '&#9820', '&#9819', '&#9818']
    ]
};

G.SETTING = {
    RGB: {
        board_white: "#CCC",
        board_black_cross: "#000",
        background: "RGBA(250,250,200,0.7)",
    },
    W: {
        black_cell: 0.2,
        black_cell_amount_of_cross_lines_on_the_half: 7,
    },
    XY: {
        board_wh: new G.F_XY(100.0, 100.0),
        board_center: new G.F_XY(50.0, 50.0),
    },
    font_scale: 1.45,
    shift_down: new G.F_XY(0.0, -0.05),
};


(function f_set_prototyoes_for_F_XY_and_F_BOARD() {
    G.F_XY.prototype.f_op_plus = function(p) {
        return new G.F_XY(this.x + p.x, this.y + p.y);
    };
    G.F_XY.prototype.f_op_minus = function(p) {
        return new G.F_XY(this.x - p.x, this.y - p.y);
    };
    G.F_XY.prototype.f_op_scale = function(n) {
        return new G.F_XY(this.x * n, this.y * n);
    };

    G.F_AB = function(a, b) {
        this.a = new G.F_XY(a.x, a.y);
        this.b = new G.F_XY(b.x, b.y);
    };

    G.F_AB.f_by_center_and_total_wh = function(c, wh) {
        var a = new G.F_XY(c.x - wh.x * 0.5, c.y - wh.y * 0.5);
        var b = new G.F_XY(c.x + wh.x * 0.5, c.y + wh.y * 0.5);
        return new G.F_AB(a, b);
    };

    G.F_BOARD = function(c00, wh) {
        this.c00 = new G.F_XY(c00.x, c00.y);
        this.wh = new G.F_XY(wh.x, wh.y);
    };

    G.F_BOARD.prototype.f_center_nxy = function(nxy) {
        var x = this.c00.x + this.wh.x * 0.125 * (nxy.x - 3.5);
        var y = this.c00.y + this.wh.y * 0.125 * (nxy.y - 3.5);
        return new G.F_XY(x, y);
    };

    G.F_BOARD.prototype.f_style_class_figures = function() {
        var my_style = '{ font: ' + Math.round(this.wh.y * 0.125 * G.SETTING.font_scale) + 'px FreeSerif}'
        return '<style>.class_figures ' + my_style + ' </style>';
    };

    G.F_BOARD.prototype.f_cell_wh = function() {
        return new G.F_XY(this.wh.x * 0.125, this.wh.y * 0.125);
    };
}());


G.BOARD = new G.F_BOARD(G.SETTING.XY.board_center, G.SETTING.XY.board_wh);