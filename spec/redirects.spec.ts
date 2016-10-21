/// <reference path="../typings/index.d.ts"/>
import * as mocha from "mocha";
import * as expect from "expect";
import Redirect from "../app/redirect";

describe("redirect", () => {
    it("should reroute to blog post", () => {
        // arrange
        const inputs =  [
            "/47/some-post-slug-here/",
            "/47/some-post-slug-here/",
            "/47/wrong-slug/",
            "/47/",
            "47/some-post-slug-here/",
            "47/some-post-slug-here/",
            "47/wrong-slug/",
            "47/",
            "/47/some-post-slug-here",
            "/47/some-post-slug-here",
            "/47/wrong-slug",
            "/47",
            "47/some-post-slug-here",
            "47/some-post-slug-here",
            "47/wrong-slug",
            "47",
        ];

        inputs.forEach(input => {
            // act
            const result = Redirect.resolve(input);

            // assert
            const expected = "/blog/47";
            expect(result).toEqual(expected, `Given '${input}'. Expected '${expected}' actual '${result}'`);
        });
    });

    it("should reroute to project page", () => {
        // arrange
        const inputs =  [
            "/portfolio/project-x/",
            "/projects/project-x/",
            "/project/project-x/",
            "/portfolio/project-x",
            "/projects/project-x",
            "/project/project-x",
            "portfolio/project-x/",
            "projects/project-x/",
            "project/project-x/",
            "portfolio/project-x",
            "projects/project-x",
            "project/project-x",
        ];

        inputs.forEach(input => {
            // act
            const result = Redirect.resolve(input);

            // assert
            const expected = "/portfolio/project-x";
            expect(result).toEqual(expected, `Given '${input}'. Expected '${expected}' actual '${result}'`);
        });
    });
    
    it("should reroute to about page", () => {
        // arrange
        const inputs =  [
            "/about/",
            "/about",
            "about/",
            "about",
        ];
        
        inputs.forEach(input => {
            // act
            const result = Redirect.resolve(input);

            // assert
            const expected = "/about";
            expect(result).toEqual(expected, `Given '${input}'. Expected '${expected}' actual '${result}'`);
        });
    });
    
    it("should reroute to portfolio index", () => {
        // arrange
        const inputs =  [
            "/portfolio/",
            "/projects/",
            "/project/",
            "/labs/",
            "/portfolio",
            "/projects",
            "/project",
            "/labs",
            "portfolio/",
            "projects/",
            "project/",
            "labs/",
            "portfolio",
            "projects",
            "project",
            "labs",
        ];
        
        inputs.forEach(input => {
            // act
            const result = Redirect.resolve(input);

            // assert
            const expected = "/portfolio";
            expect(result).toEqual(expected, `Given '${input}'. Expected '${expected}' actual '${result}'`);
        });
    });
    
    it("should reroute to blog index", () => {
        // arrange
        const inputs =  [
            "/blog/",
            "/blog",
            "blog/",
            "blog",
        ];
        
        inputs.forEach(input => {
            // act
            const result = Redirect.resolve(input);

            // assert
            const expected = "/blog";
            expect(result).toEqual(expected, `Given '${input}'. Expected '${expected}' actual '${result}'`);
        });
    });
    
    it("should reroute to root page if no resolution", () => {
        // arrange
        const inputs =  [
            "/dfgdgdfgdfg",
            "/ABC/ABCDEF",
            "/",
            "/70redgteg/",
            "/70redgteg",
            "70redgteg/",
            "70redgteg",
            "",
        ];

        inputs.forEach(input => {
            // act
            const result = Redirect.resolve(input);

            // assert
            const expected = "/";
            expect(result).toEqual(expected, `Given '${input}'. Expected '${expected}' actual '${result}'`);
        });
    });
});