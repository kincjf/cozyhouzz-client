/**
 * Created by Kimseongbok on 2016-11-07.
 */

// i18n lib - https://github.com/ocombe/ng2-translate
const PlaceType = {
    "APARTMENT": {
        name: "아파트",
        number: 1
    },
    "VILLA": {
        name: "빌라",
        number: 2
    },
    "DETACHED_HOUSE": {
        name: "주택",
        number: 3
    },
    "ONE_ROOM": {
        name: "원룸",
        number: 4
    },
    "TWO_ROOM": {
        name: "투룸",
        number: 5
    },
    "THREE_ROOM": {
        name: "쓰리룸",
        number: 6
    },
    "OFFICETEL": {
        name: "오피스텔",
        number: 7
    },

    "OFFICE": {
        name: "사무실",
        number: 100
    },
    "SHOPPING": {
        name: "상가, 매장",
        number: 101
    },
    "CAFE_RESTAURANT": {
        name: "카페, 식장",
        number: 102
    },
    "ACADEMY": {
        name: "학원, 교육관련",
        number: 103
    },
    "HOSPITAL": {
        name: "병원",
        number: 104
    }
}

enum MemberType {
    ADMIN = 0,      // 관리자
    PUBLIC_MEMBER = 1,      // 일반 회원
    BUILDING_MEMBER = 2,        // 시공업체
    LEASE_MEMBER = 3        // 임대업체
}

enum Existed {
    NO = 0, YES = 1
}

export const STATIC_VALUE = {
    MEMBER_TYPE: MemberType,
    PLACE_TYPE: PlaceType,
    EXISTED: Existed
};