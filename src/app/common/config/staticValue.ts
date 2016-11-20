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

/**
 * 인테리어, 임대업 : 1
 * 매장 홍보 : 2
 * 홈페이지, 마케팅 : 3
 * 기타 콘텐츠 활용 : 4
 */
const PARTNETS_HOUSE = [        // 주거시설
    "가람원룸", "경성하우스", "공주원룸", "글로리아", "기라성원룸", "김홍식원룸", "노벨빌리지", "다모야A", "다모야B",
    "다솜원룸", "다연원룸", "대영빌", "대학원룸", "동경빌", "로뎀나무", "론즈빌", "마로니에빌", "명인하우스", "미소빌",
    "반딧불하우스", "백제하우스", "북일교회", "비전하우스A", "서현원룸", "소망원룸", "소망하우스", "솔로몬원룸", "솔하우스",
    "수정빌", "스위스빌", "스터디빌", "싸이트빌리지", "애플하우스", "영진당하우스", "우성원룸", "원마트", "유명원룸",
    "유성원룸", "유정원룸", "이룸고시텔", "자연원룸", "좋은사람들", "중앙빌딩", "천지인", "청산빌리지", "청솔하우스",
    "케이티빌", "큰거한방", "탑빌", "터틀하우스", "테라스빌", "평화원룸", "평화하우스", "하늘빛원룸", "해피존원룸",
    "해피하우스", "행복한원룸", "행복한집", "헵시바하우스", "황금성원룸"]

const PARTNETS_ESTATE = [       // 인테리어, 장소임대업
    "아늑한집", "(주)창조건축", "컬러라인 인테리어", "청년마을", "웨딩팰리스", "추억나드리 게스트하우스", "네버랜드"
]

const PARTNETS_SHOP = [         // 매장 홍보
    "한복갤러리", "원규스튜디오", "라바르카 예복/정장", "에스떼뷰 피부관리", "주리화 한복", "아름다운사람들 미용학원",
    "등용문컴퓨터학원", "비빔한복", "어디야한복", "헬셀 전주점", "행복한 어린이집"
]

const PARTNETS_MARKETING = [        // 홈페이지, 마케팅 업체
    "인프라머스", "제로드소프트", "디딤스토리", "CM디자인", "스마트일렉", "RPTech"
]

const PARTNETS_CONTENTS = [      // 기타 콘텐츠 활용
    "허니문리조트여행", "엔젤투어여행", "YS미디어", "OPSTech"
]

const CLIENT_COMMENT = [      // What Client Says
    {
        name: "경성하우스(원룸)",
        comment: "기존의 낡은원룸에서 저렴한 인테리어와 VR사진을 통한 홍보는 저희 경성하우스에 신축원룸과의 경쟁력을 만들어 줄거라고 생각합니다."
    },
    {
        name: "(주)창조건축(인테리어업)",
        comment: "VR로 포트폴리오를 만들고 싶었는데 쉽고 저렴한 솔루션이 나와서 꼭 적용해보고 싶습니다! 고객 유치에 큰 도움이 될 것 같습니다!"
    },
    {
        name: "CM디자인",
        comment: "VR을 통한 홈페이지 빌더 플랫폼이 탄생되다니 굉장히 놀랍습니다. Web/App을 통해서 다양한 공간을 미리 볼수 있다는 점이 매우 흥미롭고, 다양한 고객층을 전문기술 없이 흡수 할수 있는 힘이 매력이라고 생각합니다."
    },
    {
        name: "인프라머스",
        comment: "기존 VR 홈페이지는 수도권 업체에서만 제작을 했었습니다. <아늑한집> 플랫폼이 Place형 홈페이지 솔루션으로 진화한다면, 분명히 고객들 또한 온라인 홍보도구로서 관심을 많이 가지고 의뢰 또한 많이 들어올 것 같습니다!  경쟁이 치열한 마케팅 시장에서 마케팅 경쟁력을 위한 새로운 바람이라고 생각합니다."
    },
    {
        name: "YS미디어",
        comment: "여행 콘텐츠부터 공사지 선정시 지상/VR 항공촬영으로 작업하고 감상을 하는데 별도의 프로그램 없이 한다니요! 본 솔루션을 이용하면 저희 회사와 고객들을 동시에 만족시킬 수 있는 최고의 솔루션입니다!!"
    }
]

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
    EXISTED: Existed,
    PARTNERS: {
        HOUSE: PARTNETS_HOUSE,
        ESTATE: PARTNETS_ESTATE,
        SHOP: PARTNETS_SHOP,
        MARKETING: PARTNETS_MARKETING,
        CONTENTS : PARTNETS_CONTENTS
    },
    CLIENT_COMMENT: CLIENT_COMMENT
};