   r.expr(
        
        [
            {
            
            "field":  "start_work_date" ,
            "logic":  "<" ,
            "value": Thu May 10 2007 00:00:00 GMT+07:00 ,
            } ,
            {
         
            "field":  "start_work_date" ,
            "logic":  ">=" ,
            "value": Sat May 10 1997 00:00:00 GMT+07:00 ,
            }
          ]
      ).map(function (fillter_condition) {
          return group_merge('employees').filter(function (f) {
                                                    return f(con_map('field')).do(function (d) {
                                                        return r.branch(con_map('logic').eq(">="),
                                                            d.ge(con_map('value')),
                                                            r.branch(con_map('logic').eq(">"),
                                                                d.gt(con_map('value')),
                                                                r.branch(con_map('logic').eq("<="),
                                                                    d.le(con_map('value')),
                                                                    r.branch(con_map('logic').eq("<"),
                                                                        d.lt(con_map('value')),
                                                                        r.branch(con_map('logic').eq("=").or(con_map('logic').eq("==")),
                                                                            d.eq(con_map('value')),
                                                                            d.ne(con_map('value'))
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    })
                                                })
      })
      