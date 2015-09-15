export default (gulp, $, config) => {
    return (name) => ({
        log: (msg) => $.util.log($.util.colors.cyan(name), msg)
        , warn: (msg) => $.util.log($.util.colors.yellow(name), msg)
        , err: (msg) => $.util.log($.util.colors.red(name), msg)
    })
};