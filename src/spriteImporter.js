export default (context, imports) => {
    return imports.forEach(({ name, asset, w, h }) => {
        context.load.spritesheet(name, asset, {
            frameWidth: w,
            frameHeight: h,
        })
    })
};