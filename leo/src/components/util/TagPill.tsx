import {memo} from "react";
import Badge from "@/components/util/Badge";

export enum PillTheme {
    NORMAL = "NORMAL", // Partially transparent gray
    PRIMARY_LIGHT = "PRIMARY_LIGHT", // Pastel purple
    LIGHT_PINK = "LIGHT_PINK", // Pastel pink
    DANGER = "DANGER", // Pastel red,
    NEUTRAL_YELLOW = "NEUTRAL_YELLOW", // Pastel yellow
    SUCCESS = "SUCCESS", // Pastel green
    NEUTRAL_BLUE = "NEUTRAL_BLUE", // Pastel blue
    PRIMARY = "PRIMARY", // Solid purple
    SOLID_WHITE = "SOLID_WHITE", // Solid white
    SOLID_PINK = "SOLID_PINK", // Solid pink
    SOLID_RED = "SOLID_RED", // Solid red
    SOLID_ORANGE = "SOLID_ORANGE", // Solid orange
    SOLID_YELLOW = "SOLID_YELLOW", // Solid yellow
    SOLID_GREEN = "SOLID_GREEN", // Solid green
    SOLID_LIGHT_BLUE = "SOLID_LIGHT_BLUE", // Solid light blue
    SOLID_NAVY = "SOLID_NAVY", // Solid navy
    SOLID_BLACK = "SOLID_BLACK", // Solid black
}

const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const getPillThemeFromHash = (str: string): PillTheme => {
    const hash = Math.abs(hashString(str));
    const themes = Object.values(PillTheme);
    return themes[hash % themes.length];
};

export enum BadgeColor {
    GRAY = "gray",
    BRAND = "brand",
    ERROR = "error",
    WARNING = "warning",
    SUCCESS = "success",
    GRAY_BLUE = "grayBlue",
    BLUE_LIGHT = "blueLight",
    BLUE = "blue",
    INDIGO = "indigo",
    PURPLE = "purple",
    PINK = "pink",
    ORANGE = "orange",
    BLACK = "black",
    WHITE = "white",
    WHITE_SUCCESS = "whiteSuccess",
}

interface VendorTagLike {
    name: string;
}

export const BadgePillThemeToColorMapping: Record<PillTheme, BadgeColor> = {
    [PillTheme.NORMAL]: BadgeColor.GRAY,
    [PillTheme.PRIMARY_LIGHT]: BadgeColor.PURPLE,
    [PillTheme.LIGHT_PINK]: BadgeColor.PINK,
    [PillTheme.DANGER]: BadgeColor.ORANGE,
    [PillTheme.NEUTRAL_YELLOW]: BadgeColor.WARNING,
    [PillTheme.SUCCESS]: BadgeColor.SUCCESS,
    [PillTheme.NEUTRAL_BLUE]: BadgeColor.BLUE_LIGHT,
    [PillTheme.PRIMARY]: BadgeColor.PURPLE,
    [PillTheme.SOLID_PINK]: BadgeColor.PINK,
    [PillTheme.SOLID_RED]: BadgeColor.ERROR,
    [PillTheme.SOLID_ORANGE]: BadgeColor.ORANGE,
    [PillTheme.SOLID_YELLOW]: BadgeColor.WARNING,
    [PillTheme.SOLID_GREEN]: BadgeColor.SUCCESS,
    [PillTheme.SOLID_LIGHT_BLUE]: BadgeColor.BLUE,
    [PillTheme.SOLID_NAVY]: BadgeColor.INDIGO,
    [PillTheme.SOLID_BLACK]: BadgeColor.BLACK,
    [PillTheme.SOLID_WHITE]: BadgeColor.WHITE,
};

export const TagPill =
    memo(function ConversationTagPill({tag,}: { tag: VendorTagLike; }) {
        const pillTheme = getPillThemeFromHash(tag.name);

        return (
            <div className="">
                <Badge
                    color={BadgePillThemeToColorMapping[pillTheme]}
                    text={tag.name}
                />
            </div>
        );
    });
