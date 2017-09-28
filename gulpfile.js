/*
 * xml -> json: http://dev.womansday.ru/?_Debug=1 http://www.freeformatter.com/xml-to-json-converter.html
 * php: https://zordius.github.io/HandlebarsCookbook/
 * */

var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

var mainData = require('./src/main.json');

gulp.task('default', function () {
    var options = {
        ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
        partials : {},
        batch : ['./src/partials'],
        helpers : {
            'applyTemplateByBlock': function (context, options) {
                const selectAttrName = context.hash.select.split('=')[0];
                const selectAttrValue = context.hash.select.split('=')[1];
                const blocks = context.data.root.block;
                const compiledTemplates = [];
                const Handlebars = handlebars.Handlebars;
                
                Object.keys(blocks).forEach((i) => {
                    const block = blocks[i];
                    
                    // нужно только некторым блокам для доступа к глобальной модели
                    block.root = context.data.root;
    
                    if (block[selectAttrName] === selectAttrValue) {
                        compileBlockTemplate(block);
                    }
                });
                
                return new Handlebars.SafeString(compiledTemplates.join('\n'));
    
                function compileBlockTemplate(block) {
                    const templateName = block['-name_admin'];
                    let template;
        
                    if (Handlebars.partials[templateName]) {
                        template = Handlebars.compile('{{> ' + templateName + ' }}');
                        compiledTemplates.push(template(block));
                    }
                }
            }
        }
    };
    
    return gulp.src('src/*.hbs')
    .pipe(handlebars(mainData, options))
    .pipe(rename({
        extname: '.html'
    }))
    .pipe(gulp.dest('dist'));
});