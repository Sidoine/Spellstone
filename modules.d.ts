interface Id {
    id: string;
}

interface StarterPack {
    id: string;
    name: string;
    description: string;
    commander_id: string;
    card: Id[];
}

type SkillId = "counter" | "armored" | "protect" | "weaken" | "rally" | "jam" | "flurry" | "heal" | "strike" | "berserk" | "poison" | "pierce" | "burn" | "leech"| "enfeeble" | "enhance" | "evade" | "imbue";

interface Skill {
    id: SkillId;
    x?: string;
    y?: string;
    c?: string;
    s?: SkillId;
    all?: "1";
}

interface Unit {
    id: string;
    card_type: string;
    fusion_level?: string;
    name: string;
    picture: string;
    hidden_until_time?: string;
    assert_bundle: string;
    attack: string;
    health: string;
    cost: string;
    rarity: string;
    type: string;
    sub_type: string|string[]|undefined;
    set: string;
    upgrade: { level: string, health?:string, attack?:string, skill?: Skill|Skill[], cost?:string }[];
    desc: string;
    skill: Skill|Skill[];
}

interface Root {
    starter_pack: StarterPack[];
    unit: Unit[];
}

interface CardData {
    root: Root;
}

declare module "*.json" {
    const value: string;
    export = value;
}